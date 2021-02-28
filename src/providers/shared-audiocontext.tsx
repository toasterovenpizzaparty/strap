import React, { createContext, useEffect, useState } from "react";
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
  const [audioContext, setAudioContext] = useState<AudioContext | undefined>(
    new AudioContext()
  );

  useEffect(() => {
    // closes the audio context, releasing any system audio resources that it uses.
    return () => {
      audioContext?.close();
    };
  }, []);
  return (
    <SharedAudioContext.Provider
      value={{
        setAudioContext: (audioContext) => {
          setAudioContext(audioContext);
        },
        audioContext,
      }}
    >
      {children}
    </SharedAudioContext.Provider>
  );
};

export default SharedAudioContextProvider;
