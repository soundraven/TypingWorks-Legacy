import { defineStore } from "pinia"
import type { TypingInfo } from "~/structure/quotes"

export const useTypedQuote = defineStore("typingStack", () => {
    const typedQuote: Ref<string[]> = ref([])

    let typingInfo: TypingInfo = reactive({
        avgWpm: 0,
        avgCpm: 0,
        maxWpm: 0,
        maxCpm: 0,
        avgTypingAccuracy: 0,
        avgTypingProgress: 0,
        count: 0,
        entireElapsedtime: 0,
    })

    const showResult: Ref<boolean> = ref(false)

    const addList = (quote: string) => {
        typedQuote.value.push(quote)
    }

    const sendTypingInfo = (info: TypingInfo) => {
        typingInfo = info
    }

    const toggleShow = () => {
        console.log("store working")
        console.log("result status:", showResult)
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
