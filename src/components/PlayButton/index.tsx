import React from "react";
import LottieAnimation from "../LottieAnimation";
import progressLoadingAnimation from "../../assets/lottie/search-location.json";
import styles from "./index.module.css";

const PlayButton = () => (
  <svg id='Capa_1' viewBox='0 0 320 320' xmlns='http://www.w3.org/2000/svg'>
    <path
      fill='rgb(25,25,25)'
      d='m295.84 146.049-256-144c-4.96-2.784-11.008-2.72-15.904.128-4.928 2.88-7.936 8.128-7.936 13.824v288c0 5.696 3.008 10.944 7.936 13.824 2.496 1.44 5.28 2.176 8.064 2.176 2.688 0 5.408-.672 7.84-2.048l256-144c5.024-2.848 8.16-8.16 8.16-13.952s-3.136-11.104-8.16-13.952z'
    />
  </svg>
);

const StopButton = () => (
  <svg fill='none' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='m6 3.25c-1.51878 0-2.75 1.23122-2.75 2.75v12c0 1.5188 1.23122 2.75 2.75 2.75h12c1.5188 0 2.75-1.2312 2.75-2.75v-12c0-1.51878-1.2312-2.75-2.75-2.75z'
      fill='rgb(25,25,25)'
    />
  </svg>
);

type PlayStopPropsType = {
  isLoading?: boolean;
  isPlaying?: boolean;
  onClick: () => void;
};

/**
 *
 * @description Shows a button for either loading, playing or stopped audio.
 */
const PlayStopButton: React.FC<PlayStopPropsType> = ({
  isLoading,
  isPlaying,
  onClick,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.button} onClick={onClick}>
        {/* There is a weird bug within Lottie that prevents animation played from conditional renders. */}
        {isLoading && (
          <LottieAnimation
            className={styles.loader}
            animationData={progressLoadingAnimation}
            playSpeed={3}
            isPlaying={isLoading}
            loop
          />
        )}
        {isLoading ? null : isPlaying ? <StopButton /> : <PlayButton />}
      </div>
    </div>
  );
};

export default PlayStopButton;
