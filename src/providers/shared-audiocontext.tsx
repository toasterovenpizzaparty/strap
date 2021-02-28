import React, { createContext, useRef, useEffect } from "react";
import { AudioContext } from "standardized-audio-context";

type AudioContextType = {
  setAudioContext: (audioContext?: AudioContext) => void;
  audioContext?: AudioContext;
};

export const SharedAudioContext = createContext<AudioContextType>({
  setAudioContext: (audioContext) => {
    console.warn("Warning no provider is setup");
  },
});

/**
 *
 * @description Provides a (shared) AudioContext to consumers.
 */
const SharedAudioContextProvider: React.FC = ({ children }) => {
  const audioContextRef = useRef<AudioContext | undefined>();
  console.log("hi");
  useEffect(() => {
    audioContextRef.current = new AudioContext();
    // closes the audio context, releasing any system audio resources that it uses.
    return () => {
      audioContextRef.current?.close();
    };
  }, []);
  return (
    <SharedAudioContext.Provider
      value={{
        setAudioContext: (audioContext) => {
          audioContextRef.current = audioContext;
        },
        audioContext: audioContextRef.current,
      }}
    >
      {children}
    </SharedAudioContext.Provider>
  );
};

export default SharedAudioContextProvider;
