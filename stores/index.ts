import { useTypingStore } from "./typing"

export const useIndexStore = defineStore("index", () => {
  const typing = () => {
    return useTypingStore()
  }

  const sentenceInfo = () => {
    return useSentenceInfoStore()
  }

  return {
    typing,
    sentenceInfo,
  }
})
