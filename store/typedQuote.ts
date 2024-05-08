import { defineStore } from "pinia"

export const useTypedQuote = defineStore("typingStack", () => {
    const typedQuote: Ref<string[]> = ref([])

    const showResult: Ref<boolean> = ref(false)

    const addList = (quote: string) => {
        typedQuote.value.push(quote)
    }

    const toggleShow = () => {
        showResult.value = !showResult.value
    }

    const resetList = () => {
        typedQuote.value = []
    }

    return { typedQuote, showResult, addList, toggleShow, resetList }
})
