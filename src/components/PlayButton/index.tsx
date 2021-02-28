import React from "react";
import LottieAnimation from "../LottieAnimation";
import progressLoadingAnimation from "../../assets/lottie/search-location.json";
import styles from "./index.module.css";

const PlayButton = () => (
  <svg
    viewBox='0 0 18 24'
    width='100%'
    height='100%'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path fill='#000000' fillRule='evenodd' d='M18 12L0 24V0' />
  </svg>
);

const StopButton = () => (
  <svg
    fill='none'
    width='100%'
    height='100%'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='m6 3.25c-1.51878 0-2.75 1.23122-2.75 2.75v12c0 1.5188 1.23122 2.75 2.75 2.75h12c1.5188 0 2.75-1.2312 2.75-2.75v-12c0-1.51878-1.2312-2.75-2.75-2.75z'
      fill='#000000'
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
