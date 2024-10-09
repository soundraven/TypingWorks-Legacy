import { defineStore } from "pinia"
import { type Sentence, type TypingInfo } from "~/types/sentence"

export const useTypingStore = defineStore("typing", () => {
  // State
  const typingInfo: TypingInfo = reactive({
    targetLanguage: "",
    targetSentenceType: "",
    avgWpm: 0,
    avgCpm: 0,
    maxWpm: 0,
    maxCpm: 0,
    avgAccuracy: 0,
    avgProgress: 0,
    count: 0,
    entireElapsedtime: 0,
  })

  const typedSentenceList: Ref<Sentence[]> = ref([])

  // Actions
  const setTypedList = (typedSentence: Sentence) => {
    typedSentenceList.value.push(typedSentence)
  }

  return {
    typingInfo,
    typedSentenceList,
    setTypedList,
  }
})
