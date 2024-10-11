import { useTypingStore } from "./typing"

export const useIndexStore = defineStore("index", () => {
  const typing = () => {
    return useTypingStore()
  }

  const language = () => {
    return useSentenceInfoStore()
  }

  return {
    typing,
    language,
  }
})
