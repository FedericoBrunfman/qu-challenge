import { shallowMount } from "@vue/test-utils";
import CustomDialog from "@/components/CustomDialog.vue"; // Update the path

describe("CustomDialog", () => {
  it("renders correctly when openDialog is true", () => {
    const wrapper = shallowMount(CustomDialog, {
      props: {
        content: [
          {
            name: "Test",
            title: "TestTitle",
            height: "170",
            mass: "70",
            director: "TestDirector",
            producer: "TestProducer",
          },
        ],
        openDialog: true,
        loadingDialog: false,
      },
    });

    expect(wrapper.find(".custom-dialog__header").exists()).toBe(true);
    expect(wrapper.vm.headers).toEqual([
      "name",
      "title",
      "height",
      "mass",
      "director",
      "producer",
    ]);
  });

  it("renders progress circular when loadingDialog is true", () => {
    const wrapper = shallowMount(CustomDialog, {
      props: {
        content: [],
        openDialog: true,
        loadingDialog: true,
      },
    });

    expect(wrapper.find("[indeterminate]").exists()).toBe(true);
  });
});
