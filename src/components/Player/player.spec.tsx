import React from "react";
import { mount, configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import SharedAudioContext from "../../providers/shared-audiocontext";
import { act } from "react-dom/test-utils";
import lottie from "lottie-web";

import { AudioContext } from "standardized-audio-context";
import axios from "axios";
jest.mock("axios");
jest.mock("standardized-audio-context");
jest.mock("lottie-web");

configure({ adapter: new Adapter() });

import Player from ".";

/*
 * Test with mock AudioContext.
 * Needs e2e in production to test the audiocontext.
 */

const loadAndPlayTrack = async () => {
  /* Setup axios mocks */
  axios.create.mockImplementation((config) => axios);
  axios.request.mockImplementationOnce(() => ({
    data: new ArrayBuffer(0),
  }));

  lottie.loadAnimation.mockImplementation(() => ({
    setSpeed: jest.fn(),
  }));

  const wrapper = mount(
    <SharedAudioContext>
      <Player url='http://myurltostream' />
    </SharedAudioContext>
  );

  expect(wrapper.find("[data-test-id='play-button']").props().isPlaying).toBe(
    false
  );
  expect(wrapper.find("[data-test-id='play-button']").props().isLoading).toBe(
    false
  );

  const mockAudioContextInstances = AudioContext.mock.instances;

  expect(mockAudioContextInstances.length).toBe(1);
  const mockAudioContextInstance = AudioContext.mock.instances[0];

  const mockStartAudio = jest.fn();
  const mockConnectAudio = jest.fn();
  mockAudioContextInstance.createBufferSource.mockImplementation(() => ({
    buffer: "",
    loop: "",
    connect: mockConnectAudio,
    start: mockStartAudio,
    stop: jest.fn(),
  }));
  mockAudioContextInstance.decodeAudioData.mockImplementation(
    (data, resolve, reject) => {
      resolve(jest.fn());
    }
  );

  await act(async () => {
    wrapper.find('[data-test-id="play-button"] > div > div').simulate("click");
  });
  wrapper.update();

  expect(axios.request).toHaveBeenCalledWith({
    responseType: "arraybuffer",
    url: "http://myurltostream",
  });

  expect(mockAudioContextInstance.decodeAudioData).toBeCalled();
  expect(mockAudioContextInstance.createBufferSource).toBeCalled();
  expect(mockStartAudio).toBeCalled();
  expect(mockConnectAudio).toBeCalled();

  return wrapper;
};

describe("<Player />", () => {
  it(
    "Loads a track upon pressing play + plays it through AudioContext",
    loadAndPlayTrack
  );

  it("Stops a track upon pressing stop", async () => {
    const mockUseRef = jest.fn();
    jest.spyOn(React, "useRef").mockImplementation(() => mockUseRef);
    const wrapper = await loadAndPlayTrack();

    expect(wrapper.find("[data-test-id='play-button']").props().isPlaying).toBe(
      true
    );
    expect(wrapper.find("[data-test-id='play-button']").props().isLoading).toBe(
      false
    );

    await act(async () => {
      wrapper
        .find('[data-test-id="play-button"] > div > div')
        .simulate("click");
    });
    wrapper.update();

    expect(wrapper.find("[data-test-id='play-button']").props().isPlaying).toBe(
      false
    );
    expect(wrapper.find("[data-test-id='play-button']").props().isLoading).toBe(
      false
    );

    expect(mockUseRef.current.stop).toBeCalledTimes(1);
  });

  it("Shows an error message upon failing to load a track", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.request.mockRejectedValueOnce();
    lottie.loadAnimation.mockImplementation(() => ({
      setSpeed: jest.fn(),
    }));

    const wrapper = mount(
      <SharedAudioContext>
        <Player url='http://myurltostream' />
      </SharedAudioContext>
    );

    await act(async () => {
      wrapper
        .find('[data-test-id="play-button"] > div > div')
        .simulate("click");
    });
    wrapper.update();

    expect(wrapper.find('[data-test-id="error-message"]').exists()).toBe(true);
  });

  it("Uses a shared AudioContext if available", () => {});

  it("Falls back to a local AudioContext if no shared AudioContext is available", () => {});
});
