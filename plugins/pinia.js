import { defineNuxtPlugin } from "nuxt/app"
import { useTypedQuote } from "~/store/typedQuote"

export default defineNuxtPlugin((nuxtapp) => {
    const _pinia = nuxtapp.$pinia
    if (!_pinia) return

    return {
        provide: {
            store: {
                typedQuote: useTypedQuote(_pinia),
            },
        },
    }
})
