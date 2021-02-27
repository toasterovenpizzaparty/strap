import { MemoryRouter, Route, Switch } from "react-router-dom";
import { mount, shallow, configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

import axios from "axios";
jest.mock("axios");

configure({ adapter: new Adapter() });

import SearchPage from ".";
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

describe("<Search />", () => {
  it("Renders a search page", () => {
    const wrapper = shallow(
      <MemoryRouter initialEntries={["/"]}>
        <Switch>
          <Route exact path='/' component={SearchPage} />
        </Switch>
      </MemoryRouter>
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it("Renders no results if path has no search term", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <Switch>
          <Route exact path='/' component={SearchPage} />
          <Route path='/search/track/:track' component={SearchPage} />
        </Switch>
      </MemoryRouter>
    );

    expect(wrapper.find('[data-test-id="results"]').exists()).toBe(false);
  });

  it("Navigates to /search/track/:track upon entering a track name", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [],
        next_href: "",
      },
    }));

    const wrapper = mount(
      <MemoryRouter data-test-id='router' initialEntries={["/"]}>
        <Switch>
          <Route exact path='/' component={SearchPage} />
          <Route path='/search/track/:track' component={SearchPage} />
        </Switch>
      </MemoryRouter>
    );

    // Set our input field to a track
    wrapper
      .find('[data-test-id="search-input"] input')
      .simulate("change", { target: { value: "Tommorowland 2019" } });

    wrapper.update();

    // Check if our value is updated accordingly.
    expect(
      wrapper.find('[data-test-id="search-input"] input').props().value
    ).toBe("Tommorowland 2019");

    expect(wrapper.find("Router").props().history.location.pathname).toBe(`/`);

    // Press the button
    await act(async () => {
      wrapper.find('[data-test-id="search-button"] button').simulate("click");
    });

    wrapper.update();

    expect(wrapper.find("Router").props().history.location.pathname).toBe(
      `/search/track/Tommorowland 2019`
    );
  });

  it("Shows search results for /search/track/:track", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [],
        next_href: "",
      },
    }));

    await act(async () => {
      const wrapper = mount(
        <MemoryRouter initialEntries={["/search/track/Tommorowland%202019"]}>
          <Switch>
            <Route path='/search/track/:track' component={SearchPage} />
          </Switch>
          <Route exact path='/' component={SearchPage} />
        </MemoryRouter>
      );
      expect(wrapper.find('[data-test-id="results"]').exists()).toBe(true);
    });
  });

  it("Clears tracks upon searches for a different track name", async () => {
    /* Setup axios mocks */
    axios.create.mockImplementation((config) => axios);
    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [
          {
            title: "Tommorowland 2019",
          },
        ],
        next_href: "",
      },
    }));

    let wrapper;

    await act(async () => {
      wrapper = mount(
        <MemoryRouter initialEntries={["/search/track/Tommorowland%202019"]}>
          <Switch>
            <Route path='/search/track/:track' component={SearchPage} />
          </Switch>
          <Route exact path='/' component={SearchPage} />
        </MemoryRouter>
      );
    });
    wrapper.update();

    axios.get.mockImplementationOnce(() => ({
      data: {
        collection: [
          {
            title: "Another track",
          },
        ],
        next_href: "",
      },
    }));

    expect(wrapper.find('[data-test-id="track-0"]').prop("title")).toBe(
      "Tommorowland 2019"
    );

    // Set our input field to a track
    wrapper
      .find('[data-test-id="search-input"] input')
      .simulate("change", { target: { value: "DJ Patrick" } });

    wrapper.update();

    // Press the button
    await act(async () => {
      wrapper.find('[data-test-id="search-button"] button').simulate("click");
    });
    wrapper.update();

    expect(wrapper.find('[data-test-id="track-0"]').prop("title")).toBe(
      "Another track"
    );
  });
});
