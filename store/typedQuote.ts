import { defineStore } from "pinia"

export const useTypedQuote = defineStore("typingStack", () => {
    const typedQuote: Ref<string[]> = ref([])

    const addList = (quote: string) => {
        typedQuote.value.push(quote)
        // if (typedQuote.value.length > 5) {
        //     typedQuote.value.shift()
        // }
    }

    // const removeList = () => {
    //     if (typedQuote.value.length > 4) {
    //         typedQuote.value.shift()
    //     }
    // }

    // function removeItem(toRemove) {
    //     items.value = items.value.filter((item) => item !== toRemove)
    // }

    return { typedQuote, addList }
})
// export const useTypedQuote = defineStore("typingStack", () => {
//     const typedQuote: Ref<string[]> = ref([])

//     const addList = (quote: string) => {
//         typedQuote.value.push(quote)
//     }

//     const removeList = () => {
//         if (typedQuote.value.length > 4) {
//             typedQuote.value.shift()
//         }
//     }

//     // function removeItem(toRemove) {
//     //     items.value = items.value.filter((item) => item !== toRemove)
//     // }

//     return { typedQuote, addList, removeList }
// })
