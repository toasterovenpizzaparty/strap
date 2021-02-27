import React, { useState, useCallback } from "react";
import { useHistory, useParams, generatePath } from "react-router-dom";
import { Title, TextInput, Button } from "../../components";
import { RouteParamTypes } from "../../types/route-types";
import SearchResults from "./partials/results";
import styles from "./index.module.css";

export default () => {
  const history = useHistory();
  const { track: trackSearchTerm } = useParams<RouteParamTypes>();
  const [searchTerm, setSearchTerm] = useState(trackSearchTerm || "");

  /**
   * @description Use history for search term changes, provides convenience for the user.
   */
  const submitSearch = useCallback(() => {
    history.push(generatePath("/search/track/:track", { track: searchTerm }));
  }, [searchTerm]);

  return (
    <>
      <header className={styles.search}>
        <div className={styles.wrapper}>
          <Title>Find your tracks on Soundcloud</Title>
          <TextInput
            data-test-id='search-input'
            placeholder='An amazing track'
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
            onKeyUp={(key) =>
              searchTerm && key?.toLowerCase() === "enter" && submitSearch()
            }
          />
          <Button
            className={styles.searchButton}
            data-test-id='search-button'
            isDisabled={!searchTerm}
            onClick={submitSearch}
          >
            Search
          </Button>
        </div>
      </header>
      {trackSearchTerm && (
        <SearchResults
          data-test-id='results'
          trackSearchTerm={trackSearchTerm}
        />
      )}
    </>
  );
};
