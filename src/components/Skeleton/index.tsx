import React from "react";

type SkeletonPropsType = {
  color?: string;
  className?: string;
};

/**
 *
 * @description Provides a rectangle skeleton svg
 */
const SkeletonRectangle: React.FC<SkeletonPropsType> = ({
  color = "#ffffff",
  className,
}) => (
  <svg viewBox='0 0 200 200' version='1.1' className={className}>
    <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g id='v' transform='translate(-213.000000, -149.000000)' fill={color}>
        <rect id='Rectangle' x='213' y='149' width='200' height='200'></rect>
      </g>
    </g>
  </svg>
);

/**
 *
 * @description Provides a line skeleton svg
 */
const SkeletonLine: React.FC<SkeletonPropsType> = ({
  color = "#ffffff",
  className,
}) => (
  <svg viewBox='0 0 300 15' className={className}>
    <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
      <g id='v' transform='translate(-213.000000, -149.000000)' fill={color}>
        <rect id='Rectangle' x='213' y='149' width='300' height='15'></rect>
      </g>
    </g>
  </svg>
);

export { SkeletonLine, SkeletonRectangle };
