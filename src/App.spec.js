import App from "./App.vue";
import { mount } from "@vue/test-utils";
import axios from "axios";
import { expect } from "vitest";

vi.mock("axios");
const planets = [
  {
    name: "Earth",
    rotation_period: "24",
    orbital_period: "365",
    diameter: "10465",
    climate: "temperate",
    gravity: "1 standard",
    terrain: "grasslands, mountains",
    surface_water: "1",
    population: "123456789",
    residents: [],
    films: [],
    created: "2014-12-10T11:35:48.479000Z",
    edited: "2014-12-20T20:58:18.420000Z",
    url: "https://swapi.dev/api/planets/1/",
  },
];

describe("App", () => {
  it("renders properly", () => {
    const wrapper = mount(App);
    expect(wrapper.exists()).toBe(true);
  });
  it("sorts planets by name", async () => {
    const wrapper = mount(App);
    wrapper.setData({
      planets: [
        { name: "Earth", data: [] },
        { name: "Mars", data: [] },
      ],
      direction: 1,
    });

    await wrapper.vm.sortByName(-1);
    expect(wrapper.vm.planets[0].name).toBe("Mars");

    await wrapper.vm.sortByName(1);
    expect(wrapper.vm.planets[0].name).toBe("Earth");
  });

  it("shows loading spinner when loading is true", () => {
    const wrapper = mount(App, {
      data() {
        return {
          loading: true,
        };
      },
    });
    expect(wrapper.find(".planet-list__loading").exists()).toBe(true);
  });
  it("planetsMapped returns an array of planets", () => {
    const wrapper = mount(App);
    const result = wrapper.vm.planetsMapped(planets);
    expect(result[0].name).toBe("Earth");
    expect(result[0].data[0].text).toBe("Earth");
    expect(result[0].data[1].text).toBe("24");
    expect(result[0].data[2].text).toBe("365");
    expect(result[0].data[3].text).toBe("10465");
    expect(result[0].data[4].text).toBe("temperate");
    expect(result[0].data[5].text).toBe("1 standard");
    expect(result[0].data[6].text).toBe("1");
    expect(result[0].data[7].text).toBe("123456789");
    expect(result[0].data[8].text).toBe("No residents");
    expect(result[0].data[9].text).toBe("No films");
    expect(result[0].data[10].text).toBe("https://swapi.dev/api/planets/1/");
  });
  it("fetches planets, maps them and updates pageCount", async () => {
    const wrapper = mount(App);
    const mockData = {
      data: {
        results: planets,
        count: 10,
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    await wrapper.vm.getPlanets();

    expect(wrapper.vm.planets).toEqual(
      wrapper.vm.planetsMapped(mockData.data.results)
    );
    expect(wrapper.vm.pageCount).toBe(10);
    expect(wrapper.vm.progressLoading).toBe(false);
  });

  it("handles error gracefully", async () => {
    const wrapper = mount(App);
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    await wrapper.vm.getPlanets();

    expect(wrapper.vm.snackbar.show).toBe(true);
    expect(wrapper.vm.progressLoading).toBe(false);
  });
});
