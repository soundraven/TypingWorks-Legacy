export const useIndexStore = defineStore("index", () => {
  const typing = () => {
    return useTypingStore()
  }

  const sentenceInfo = () => {
    return useSentenceInfoStore()
  }

  const user = () => {
    return useUserStore()
  }

  return {
    typing,
    sentenceInfo,
    user,
  }
})
