import React, { useState, useEffect, useMemo, useCallback } from "react";
import { client } from "../../../config/axios";
import { Button, Track, ErrorMessage } from "../../../components";

import SharedAudioContextProvider from "../../../providers/shared-audiocontext";
import styles from "./results.module.css";

type SoundCloudItemType = {
  title: string;
  duration: number;
  stream_url: string;
  download_url: string;
  downloadable: boolean;
  waveform_url: string;
  user: {
    avatar_url: string;
    username: string;
  };
};

type SoundCloudCollectionType<T> = {
  collection: T;
  next_href: string;
};

type SearchResultsPropsType = {
  trackSearchTerm?: string;
};

export const NUM_RESULTS = 10;

const SearchResults: React.FC<SearchResultsPropsType> = ({
  children,
  trackSearchTerm,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [nextHref, setNextHref] = useState("");
  const [tracks, setTracks] = useState<SoundCloudItemType[]>([]);

  /**
   * @param url The SoundCloud API url to retrieve the tracks from.
   * @param clearTracks Clears the track list before searching.
   * @description Retrieve tracks and append to the tracks list
   */
  const loadTracks = useCallback(
    async (url: string, clearTracks: boolean = false) => {
      setLoading(true);
      setIsError(false);
      if (clearTracks) {
        setTracks([]);
        setNextHref("");
      }
      try {
        const response = await client().get<
          SoundCloudCollectionType<SoundCloudItemType[]>
        >(url);
        if (response?.data?.collection) {
          setTracks(
            !clearTracks
              ? [...tracks, ...response?.data?.collection]
              : [...response?.data?.collection]
          );
          setNextHref(response?.data?.next_href);
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
      setLoading(false);
    },
    [tracks]
  );
  /**
   * @description Upon changing the trackSearchTerm, initiate a search for tracks on SoundCloud.
   */
  useEffect(() => {
    // Search for tracks, clear the current list.
    loadTracks(
      `/tracks?q=${trackSearchTerm}&linked_partitioning=true&limit=${NUM_RESULTS}`,
      true
    );
  }, [trackSearchTerm]);

  /**
   * @description Provide a memoized list of tracks
   */
  const trackList = useMemo(
    () =>
      tracks.map((track, index) => (
        <Track
          data-test-id={`track-${index}`}
          key={`track-${index}`}
          artist={track?.user?.username}
          title={track?.title}
          duration={track?.duration || 0}
          url={track?.downloadable ? track?.download_url : track?.stream_url}
          artistPicture={track?.user?.avatar_url}
          wavePicture={track?.waveform_url}
        />
      )),
    [tracks]
  );

  return (
    <SharedAudioContextProvider>
      <section className={styles.wrapper}>
        <ErrorMessage data-test-id='result-error' isVisible={isError}>
          Something went wrong while retrieving tracks
        </ErrorMessage>
        {isLoading
          ? // Displays a skeletal ui while retrieving results.
            Array.from({ length: 10 }).map((data, index) => (
              <Track
                title=''
                duration={0}
                artist=''
                url=''
                data-test-id={`track-${index}`}
                key={`track-${index}`}
                isSkeleton
              />
            ))
          : trackList}
        {!!nextHref && (
          // Display a load more button, appending more search results to the list.
          <div className={styles.loadmore}>
            <Button
              data-test-id='load-more'
              isDisabled={isLoading}
              className={styles.loadmore__button}
              onClick={() => loadTracks(nextHref)}
            >
              Load more
            </Button>
          </div>
        )}
      </section>
    </SharedAudioContextProvider>
  );
};

export default SearchResults;
