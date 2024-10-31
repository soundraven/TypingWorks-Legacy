import type { EChartsType } from "echarts"

declare module "nuxt/app" {
  interface NuxtApp {
    $echarts: typeof import("echarts")
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $echarts: typeof import("echarts")
  }
}
