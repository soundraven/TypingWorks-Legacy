import { $apiGet } from "~/services/api"
import type { Language, SentenceInfo, Type } from "~/types/sentence"

export const useSentenceInfoStore = defineStore("sentenceInfo", () => {
  const languages: Ref<Language[]> = ref([])
  const languageNames: Ref<string[]> = ref([])
  const languageCodes: Ref<string[]> = ref([])

  const types: Ref<Type[]> = ref([])
  const typeNames: Ref<string[]> = ref([])
  const typeCodes: Ref<string[]> = ref([])

  const getSentenceInfo = async () => {
    try {
      const sentenceInfo = await $apiGet<SentenceInfo>("/typing/sentenceInfo")

      languages.value = sentenceInfo.languageInfo
      languageNames.value = sentenceInfo.languageInfo.map(
        (language) => language.name,
      )
      languageCodes.value = sentenceInfo.languageInfo.map(
        (language) => language.code,
      )

      types.value = sentenceInfo.typeInfo
      typeNames.value = sentenceInfo.typeInfo.map((type) => type.name)
      typeCodes.value = sentenceInfo.typeInfo.map((type) => type.code)
    } catch (error: any) {
      ElMessage({
        message: `"Failed to fetch sentence info:", ${error.message}`,
        type: "error",
      })
    }
  }

  return {
    languages,
    languageNames,
    types,
    typeNames,
    getSentenceInfo,
  }
})
