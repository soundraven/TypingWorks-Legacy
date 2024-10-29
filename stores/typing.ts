import { $apiPost } from "~/services/api"
import type { RecordResponse } from "~/types/apiResponse"
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
    entireElapsedTime: 0,
  })

  const typedSentenceList: Ref<Sentence[]> = ref([])

  // Actions
  const setLanguageAndType = (
    targetLanguage: string,
    targetSentenceType: string,
  ): void => {
    typingInfo.targetLanguage = targetLanguage
    typingInfo.targetSentenceType = targetSentenceType
  }

  const setTypedList = (typedSentence: Sentence): void => {
    typedSentenceList.value.push(typedSentence)
  }

  const countUp = (): void => {
    typingInfo.count++
  }

  const resetTypingInfo = async (): Promise<void> => {
    const response = await $apiPost<RecordResponse>("/typing/record", {
      typingInfo: typingInfo,
    })

    if (response.success === true) {
      typingInfo.targetLanguage = ""
      typingInfo.targetSentenceType = ""
      typingInfo.avgWpm = 0
      typingInfo.avgCpm = 0
      typingInfo.maxWpm = 0
      typingInfo.maxCpm = 0
      typingInfo.avgAccuracy = 0
      typingInfo.avgProgress = 0
      typingInfo.count = 0
      typingInfo.entireElapsedTime = 0
    }
  }

  const updateTypingInfo = (
    wpmArray: number[],
    cpmArray: number[],
    accuracyArray: number[],
    progressArray: number[],
    elapsedTimeArray: number[],
  ): void => {
    const avgWpm = getAvgValue(wpmArray)
    const avgCpm = getAvgValue(cpmArray)
    const avgAccuracy = getAvgValue(accuracyArray)
    const avgProgress = getAvgValue(progressArray)

    const entireElapsedTime = elapsedTimeArray.reduce((acc, cur) => acc + cur)

    typingInfo.maxWpm = Math.max(...wpmArray)
    typingInfo.maxCpm = Math.max(...cpmArray)
    typingInfo.avgWpm = avgWpm
    typingInfo.avgCpm = avgCpm
    typingInfo.avgAccuracy = avgAccuracy
    typingInfo.avgProgress = avgProgress
    typingInfo.entireElapsedTime = entireElapsedTime
  }

  return {
    typingInfo,
    typedSentenceList,
    setLanguageAndType,
    setTypedList,
    countUp,
    resetTypingInfo,
    updateTypingInfo,
  }
})
