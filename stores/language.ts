import { $apiGet } from "~/services/api"
import type { Language } from "~/types/sentence"

export const useLanguageStore = defineStore("language", () => {
  const languages = ref<Language[]>([])

  const getLanguages = async () => {
    try {
      const result = await $apiGet<Language[]>("/typing/language")
      languages.value = result
      console.log(languages.value)
    } catch (error: any) {
      console.error("Failed to fetch languages:", error.message)
    }
  }

  return {
    languages,
    getLanguages,
  }
})
