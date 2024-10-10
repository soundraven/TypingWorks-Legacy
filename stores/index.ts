import { useTypingStore } from "./typing"

export const useIndexStore = defineStore("index", () => {
  const typing = () => {
    return useTypingStore()
  }

  const language = () => {
    return useLanguageStore()
  }

  return {
    typing,
    language,
  }
})
