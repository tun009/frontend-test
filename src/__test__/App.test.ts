import { mount } from '@vue/test-utils';
import { expect, it } from "vitest";
import App from "../App.vue";

it("App renders correctly", () => {
  const wrapper = mount(App);
  expect(wrapper.exists()).toBe(true);
});
