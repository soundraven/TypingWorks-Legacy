import { defineStore } from "pinia"

export const useTypedQuote = defineStore("typingStack", () => {
    const typedQuote: Ref<string[]> = ref([])

    const addList = (quote: string) => {
        typedQuote.value.push(quote)
    }

    return { typedQuote, addList }
})
