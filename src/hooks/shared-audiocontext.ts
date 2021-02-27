import { useContext } from "react";
import { SharedAudioContext } from "../providers/shared-audiocontext";

/**
 * @description Provides a hook to get/set (shared) AudioContext
 */
export const useSharedAudioContext = () => useContext(SharedAudioContext);
