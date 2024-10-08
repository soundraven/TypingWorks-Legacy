import { defineStore } from "pinia"
import {
  Language,
  QuoteType,
  type Quote,
  type TypingInfo,
} from "~/structure/sentence"

export const useTypedQuote = defineStore("typingStack", () => {
  const showResult: Ref<boolean> = ref(false)

  let typingInfo: TypingInfo = reactive({
    targetLanguage: Language.Korean,
    targetQuoteType: QuoteType.LifeQuote,
    targetSentence: "",
    avgWpm: 0,
    avgCpm: 0,
    maxWpm: 0,
    maxCpm: 0,
    avgAccuracy: 0,
    avgProgress: 0,
    count: 0,
    entireElapsedtime: 0,
  })

  const typedQuote: Ref<Quote[]> = ref([])

  const addList = (quote: string, person: string) => {
    typedQuote.value.push({ quote: quote, person: person })
  }

  const sendTypingInfo = (info: TypingInfo) => {
    typingInfo = info
    console.log(info, typingInfo)
  }

  const toggleShow = () => {
    showResult.value = !showResult.value
  }

  const resetList = () => {
    typedQuote.value = []
  }

  return {
    typedQuote,
    showResult,
    typingInfo,
    addList,
    toggleShow,
    resetList,
    sendTypingInfo,
  }
})
