import { defineStore } from "pinia";
export const useExampleStore = defineStore("example", () => {
    const exampleBoolean = ref(false);

    const setExampleBoolean = (value) => {
        exampleBoolean.value = value;
    };

    return { exampleBoolean, setExampleBoolean };
});
