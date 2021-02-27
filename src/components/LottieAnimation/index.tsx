import React, { useRef, useEffect } from "react";
import lottie, { AnimationConfigWithData, AnimationItem } from "lottie-web";

type LottieAnimationPropsType = {
  loop?: boolean;
  autoplay?: boolean;
  isPlaying?: boolean;
  className?: string;
  playSpeed?: number;
} & Pick<AnimationConfigWithData, "animationData">;

const LottieAnimation: React.FC<LottieAnimationPropsType> = ({
  loop = false,
  autoplay = false,
  isPlaying = false,
  className = "",
  animationData,
  playSpeed = 1,
}) => {
  const container = useRef<HTMLElement>(null);
  const animationItem = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (container.current) {
      animationItem.current = lottie.loadAnimation({
        renderer: "svg",
        container: container.current,
        loop,
        autoplay,
        animationData,
      });
      animationItem.current.setSpeed(playSpeed);
    }
  }, []);

  useEffect(() => {
    if (animationItem.current && animationItem.current?.isLoaded) {
      !animationItem.current?.isPaused
        ? animationItem.current?.stop()
        : animationItem.current?.play();
    }
  }, [isPlaying, animationItem.current?.isLoaded]);

  return <figure className={className} ref={container} />;
};

export default LottieAnimation;
