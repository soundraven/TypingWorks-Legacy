import { type TypingInfo } from "~/types/sentence"

export const useTypedQuote = defineStore("typingStack", () => {
  const showResult: Ref<boolean> = ref(false)

  let typingInfo = reactive({
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

  const typedQuote = ref([])

  const addList = (quote: string, person: string) => {
    // typedQuote.value.push({ quote person})
  }

  const sendTypingInfo = (info: TypingInfo) => {
    // typingInfo = info
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
