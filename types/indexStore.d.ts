import { useIndexStore } from "@/stores/index"

type IndexStoreType = ReturnType<typeof useIndexStore>

declare module "nuxt/app" {
  interface NuxtApp {
    $indexStore: IndexStoreType
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $indexStore: IndexStoreType
  }
}
