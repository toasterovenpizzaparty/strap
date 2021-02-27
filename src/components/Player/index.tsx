import React, { useCallback, useEffect } from "react";
import {
  IAudioBufferSourceNode,
  IAudioContext,
  IAudioBuffer,
} from "standardized-audio-context";
import { client } from "../../config/axios";
import { useSharedAudioContext } from "../../hooks/shared-audiocontext";
import { PlayButton, ErrorMessage } from "../../components";
import styles from "./index.module.css";

type PlayerPropsType = {
  url: string;
  wavePicture?: string;
};

/**
 *
 * @param url The url to the track
 * @param wavePicture The url to the (audio) waveform picture
 * @description Provides a player for loading and playback of tracks through WebAudio.
 */
const Player: React.FC<PlayerPropsType> = ({ url, wavePicture }) => {
  const { audioContext } = useSharedAudioContext();
  const source = React.useRef<IAudioBufferSourceNode<IAudioContext>>();
  const [isTrackLoaded, setIsTrackLoaded] = React.useState(false);
  const [isTrackLoading, setIsTrackLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  /**
   * @description Load a track using WebAudio, start playing upon loaded.
   */
  const loadTrack = useCallback(async () => {
    if (!audioContext) {
      console.warn("No shared audio context was found.");
    }
    if (isTrackLoaded || !audioContext) {
      return;
    }
    setIsError(false);
    setIsTrackLoading(true);
    try {
      const response = await client().request({
        url,
        responseType: "arraybuffer",
      });

      const buffer: IAudioBuffer = await new Promise((resolve, reject) => {
        audioContext.decodeAudioData(response.data, resolve, reject);
      });
      source.current = audioContext.createBufferSource();
      source.current.buffer = buffer;
      source.current.loop = true;
      source.current.connect(audioContext.destination);
      source.current.start(0);
      setIsTrackLoaded(true);
    } catch (error) {
      console.log("error loading track", error);
      setIsError(true);
    }
    setIsTrackLoading(false);
  }, [url, audioContext]);

  /**
   * @description Ensure any WebAudio still playing is stopped when this element is unmounted.
   */
  useEffect(() => {
    return () => {
      source.current?.stop(0);
    };
  }, []);

  /**
   * @description Stops playback of audio
   */
  const stopPlayback = () => {
    source.current?.stop(0);
    setIsTrackLoaded(false);
  };

  return (
    <div className={styles.player}>
      <div className={styles["player__waveform--spacer"]} />
      <img className={styles["player__waveform"]} src={wavePicture} />
      <div className={styles["player__controls"]}>
        <PlayButton
          data-test-id='play-button'
          onClick={() => (isTrackLoaded ? stopPlayback() : loadTrack())}
          isPlaying={isTrackLoaded}
          isLoading={isTrackLoading}
        />
      </div>
      <ErrorMessage
        className={styles.player__error}
        data-test-id='error-message'
        isVisible={isError}
      >
        An error occured while trying to load the track.
      </ErrorMessage>
    </div>
  );
};

export default Player;
