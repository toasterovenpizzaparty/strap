import React from "react";
import Player from "../Player";
import styles from "./index.module.css";
import { SkeletonLine, SkeletonRectangle } from "../Skeleton";

type TrackType = {
  artist: string;
  title: string;
  duration: number;
  url: string;
  artistPicture?: string;
  wavePicture?: string;
  isSkeleton?: boolean;
};

const formatToHHMMSS = (seconds: number) =>
  new Date(seconds).toISOString().substr(11, 8);

const TrackDetailsSkeleton = () => (
  <>
    <SkeletonLine className={styles["details__artist--skeleton"]} />
    <SkeletonLine className={styles["details__title--skeleton"]} />
    <SkeletonLine className={styles["details__duration--skeleton"]} />
  </>
);

/**
 * @param artistPicture A picture of the artist.
 * @param wavePicture A picture of the waveform.
 * @param isSkeleton Switch to a skeleton view layout for loading purposes.
 * @description Provides a UI to display track information.
 */
const Track: React.FC<TrackType> = ({
  artist,
  title,
  duration,
  url,
  artistPicture = "",
  wavePicture = "",
  isSkeleton = false,
}) => (
  <div>
    <div className={styles.trackDetails}>
      <div className={styles.waveform}>
        {isSkeleton ? (
          <SkeletonRectangle className={styles.waveform__skeleton} />
        ) : (
          <Player url={url} wavePicture={wavePicture} />
        )}
      </div>
      <div className={styles.details}>
        {isSkeleton ? (
          <SkeletonRectangle className={styles.details__picture} />
        ) : (
          <figure
            className={styles["details__picture"]}
            style={{ backgroundImage: `url(${artistPicture})` }}
          />
        )}
        <div className={styles["details__track"]}>
          {isSkeleton ? (
            <TrackDetailsSkeleton />
          ) : (
            <>
              <p className={styles["details__artist"]}>{artist}</p>
              <p className={styles["details__title"]}>{title}</p>
              <p className={styles["details__duration"]}>
                {formatToHHMMSS(duration)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default Track;
