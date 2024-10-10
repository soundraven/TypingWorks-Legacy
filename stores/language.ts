import { $apiGet } from "~/services/api"
import type { Language } from "~/types/sentence"

export const useLanguageStore = defineStore("language", () => {
  const languages: Ref<Language[]> = ref([])
  const languageNames: Ref<string[]> = ref([])
  const lnaguageCodes: Ref<string[]> = ref([])

  const getLanguages = async () => {
    try {
      const result = await $apiGet<Language[]>("/typing/language")
      languages.value = result
      languageNames.value = result.map((langauge) => langauge.name)
      lnaguageCodes.value = result.map((language) => language.code)
      console.log(languages.value)
      console.log(languageNames.value)
      console.log(lnaguageCodes.value)
    } catch (error: any) {
      console.error("Failed to fetch languages:", error.message)
    }
  }

  return {
    languages,
    languageNames,
    getLanguages,
  }
})
