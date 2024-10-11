import { defineNuxtPlugin } from "nuxt/app"
import { useIndexStore } from "~/stores/index"

export default defineNuxtPlugin(async (nuxtApp) => {
  const indexStore = useIndexStore()
  await indexStore.sentenceInfo().getSentenceInfo()
  nuxtApp.provide("indexStore", indexStore)
})