import { $apiGet } from "~/services/api"
import type { Language, Type } from "~/types/sentence"

export const useSentenceInfoStore = defineStore("sentenceInfo", () => {
  const languages: Ref<Language[]> = ref([])
  const languageNames: Ref<string[]> = ref([])
  const lnaguageCodes: Ref<string[]> = ref([])

  const type: Ref<Type[]> = ref([])
  const typeNames: Ref<string[]> = ref([])
  const typeCodes: Ref<string[]> = ref([])

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
      ElMessage({
        message: `"Failed to fetch languages:", ${error.message}`,
        type: "error",
      })
    }
  }

  const getTypes = async () => {
    try {
      const result = await $apiGet<Type[]>("typing/type")
      type.value = result
      typeNames.value = result.map((type) => type.name)
      typeCodes.value = result.map((type) => type.code)
      console.log(type.value)
      console.log(typeNames.value)
      console.log(typeCodes.value)
    } catch (error: any) {
      ElMessage({
        message: `"Failed to fetch types:", ${error.message}`,
        type: "error",
      })
    }
  }

  return {
    languages,
    languageNames,
    getLanguages,
    type,
    typeNames,
    getTypes,
  }
})
