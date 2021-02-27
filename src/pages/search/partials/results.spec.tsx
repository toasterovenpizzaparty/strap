import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { mount, shallow, configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { AudioContext } from "standardized-audio-context";
import { NUM_RESULTS } from "./results";

import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("axios");
jest.mock("lottie-web");

configure({ adapter: new Adapter() });

import SearchResults from "./results";
import { act } from "react-dom/test-utils";

/*
 * Test with mock AudioContext.
 * Needs e2e in production to test the audiocontext.
 */
jest.mock("standardized-audio-context", () => {
  const mockAudioContext = jest.fn();
  return {
    ...jest.requireActual("standardized-audio-context"),
    AudioContext: mockAudioContext,
  };
});

describe("<Results />", () => {
  it("Appends tracks upon pressing [Load More]", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [
          {
            title: "Tommorowland 2019",
            duration: 123456,
            stream_url: "http://streamme/",
            download_url: "http://downloadme/",
            downloadable: true,
            user: {
              username: "Patrick van der Werf",
            },
          },
        ],
        next_href: "http://loadmoreresults",
      },
    }));

    let wrapper;

    await act(async () => {
      wrapper = mount(<SearchResults trackSearchTerm='Tommorowland 2019' />);
    });
    wrapper.update();

    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [
          {
            title: "Tommorowland 2020",
            duration: 123456,
            stream_url: "http://streamme/",
            download_url: "http://downloadme/",
            downloadable: true,
            user: {
              username: "Patrick van der Werf",
            },
          },
        ],
        next_href: "http://loadmoreresults",
      },
    }));

    expect(wrapper.find('[data-test-id="track-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="track-1"]').exists()).toBe(false);
    expect(wrapper.find('[data-test-id="load-more"]').exists()).toBe(true);
    await act(async () =>
      wrapper.find('[data-test-id="load-more"]').simulate("click")
    );
    wrapper.update();
    expect(wrapper.find('[data-test-id="track-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="track-1"]').exists()).toBe(true);
  });

  it("Shows no [Load More] button if no additional tracks are available", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [],
        next_href: "",
      },
    }));

    let wrapper;

    await act(async () => {
      wrapper = mount(<SearchResults trackSearchTerm='Tommorowland 2019' />);
    });
    expect(wrapper.find('[data-test-id="load-more"]').exists()).toBe(false);
  });
});

describe("<API />", () => {
  it("Searches for tracks using the SoundCloud API", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [],
        next_href: "",
      },
    }));

    let wrapper;

    await act(async () => {
      wrapper = mount(<SearchResults trackSearchTerm='Tommorowland 2019' />);
    });
    expect(axios.get).toHaveBeenCalledWith(
      `/tracks?q=Tommorowland 2019&linked_partitioning=true&limit=${NUM_RESULTS}`
    );
  });

  it("Shows the correct track information in results", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [
          {
            title: "Tommorowland 2019",
            duration: 123456,
            stream_url: "http://streamme/",
            download_url: "http://downloadme/",
            downloadable: true,
            user: {
              username: "Patrick van der Werf",
            },
          },
        ],
        next_href: "",
      },
    }));

    let wrapper;

    await act(async () => {
      wrapper = mount(<SearchResults trackSearchTerm='Tommorowland 2019' />);
    });
    wrapper.update();

    expect(wrapper.find('[data-test-id="track-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-test-id="track-0"]').props()).toEqual({
      artist: "Patrick van der Werf",
      "data-test-id": "track-0",
      duration: 123456,
      title: "Tommorowland 2019",
      url: "http://downloadme/",
    });
  });
  it("Shows a loading message while retrieving tracks", () => {});

  it("Shows an error message if tracks could not be retrieved", () => {});
});
