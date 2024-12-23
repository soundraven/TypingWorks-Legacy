import { defineNuxtPlugin } from "nuxt/app"
import { useIndexStore } from "~/stores/index"

export default defineNuxtPlugin(async (nuxtApp) => {
  const indexStore = useIndexStore()
  nuxtApp.provide("indexStore", indexStore)
})
