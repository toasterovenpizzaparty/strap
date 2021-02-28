import React, { useEffect, useRef, useState } from "react";
import {
  IAudioBufferSourceNode,
  IAudioContext,
  IGainNode,
} from "standardized-audio-context";
import { useSharedAudioContext } from "../../hooks/shared-audiocontext";
import styles from "./index.module.css";

type EqualizerPropsType = {
  source?: IAudioBufferSourceNode<IAudioContext>;
  className?: string;
};

type GainsType = {
  lowGain: number;
  midGain: number;
  highGain: number;
};

const Equalizer: React.FC<EqualizerPropsType> = ({ source, className }) => {
  const { audioContext } = useSharedAudioContext();
  const [isEnabled, setIsEnabled] = useState(false);
  const [gains, setGains] = useState<GainsType>({
    lowGain: 0,
    midGain: 0,
    highGain: 0,
  });

  const lGain = useRef<IGainNode<IAudioContext>>();
  const mGain = useRef<IGainNode<IAudioContext>>();
  const hGain = useRef<IGainNode<IAudioContext>>();

  const isDisabled = !isEnabled || !source;

  useEffect(() => {
    if (audioContext && source && isEnabled) {
      const gainDb = -40.0;
      const bandSplit = [360, 3600];

      const hBand = audioContext.createBiquadFilter();
      hBand.type = "lowshelf";
      hBand.frequency.value = bandSplit[0];
      hBand.gain.value = gainDb;

      const hInvert = audioContext.createGain();
      hInvert.gain.value = -1.0;

      const mBand = audioContext.createGain();

      const lBand = audioContext.createBiquadFilter();
      lBand.type = "highshelf";
      lBand.frequency.value = bandSplit[1];
      lBand.gain.value = gainDb;

      const lInvert = audioContext.createGain();
      lInvert.gain.value = -1.0;

      source.connect(lBand);
      source.connect(mBand);
      source.connect(hBand);

      hBand.connect(hInvert);
      lBand.connect(lInvert);

      hInvert.connect(mBand);
      lInvert.connect(mBand);

      lGain.current = audioContext.createGain();
      mGain.current = audioContext.createGain();
      hGain.current = audioContext.createGain();

      lGain.current.gain.value = gains.lowGain;
      mGain.current.gain.value = gains.midGain;
      hGain.current.gain.value = gains.highGain;

      lBand.connect(lGain.current);
      mBand.connect(mGain.current);
      hBand.connect(hGain.current);

      const sum = audioContext.createGain();
      lGain.current.connect(sum);
      mGain.current.connect(sum);
      hGain.current.connect(sum);
      sum.connect(audioContext.destination);

      return () => {
        source.disconnect(lBand);
        source.disconnect(mBand);
        source.disconnect(hBand);
      };
    }
  }, [source, isEnabled]);

  useEffect(() => {
    if (isEnabled) {
      if (lGain.current) lGain.current.gain.value = gains.lowGain;
      if (mGain.current) mGain.current.gain.value = gains.midGain;
      if (hGain.current) hGain.current.gain.value = gains.highGain;
    }
  }, [gains]);

  return (
    <section className={[styles.equalizer, className].join(" ")}>
      <div className={styles.equalizer__controls}>
        <label>Enable equalizer</label>
        <input type='checkbox' onClick={() => setIsEnabled(!isEnabled)}></input>
      </div>
      <div className={styles.equalizer__controls}>
        <label>Low Gain</label>
        <input
          type='range'
          disabled={isDisabled}
          step='1'
          min='0'
          max='100'
          value={gains.lowGain}
          onChange={(event) =>
            setGains((state) => ({
              ...state,
              lowGain: parseFloat(event.target.value),
            }))
          }
        ></input>
      </div>
      <div className={styles.equalizer__controls}>
        <label>Mid Gain</label>
        <input
          type='range'
          disabled={isDisabled}
          value={gains.midGain}
          step='1'
          min='0'
          max='100'
          onChange={(event) =>
            setGains((state) => ({
              ...state,
              midGain: parseFloat(event.target.value),
            }))
          }
        ></input>
      </div>
      <div className={styles.equalizer__controls}>
        <label>High Gain</label>
        <input
          type='range'
          disabled={isDisabled}
          value={gains.highGain}
          step='1'
          min='0'
          max='100'
          onChange={(event) =>
            setGains((state) => ({
              ...state,
              highGain: parseFloat(event.target.value),
            }))
          }
        ></input>
      </div>
    </section>
  );
};

export default Equalizer;
