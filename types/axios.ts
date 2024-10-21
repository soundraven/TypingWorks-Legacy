import { type AxiosInstance } from "axios"
// NuxtApp 인터페이스에 $apiPost와 $apiGet 정의 추가
declare module "nuxt/app" {
  interface NuxtApp {
    $axios: AxiosInstance
    $apiPost: <T>(url: string, data: any, config?: any) => Promise<T>
    $apiGet: <T>(url: string, params?: any, config?: any) => Promise<T>
  }
}

// ComponentCustomProperties 인터페이스에 $apiPost와 $apiGet 정의 추가
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $apiPost: <T>(url: string, data: any, config?: any) => Promise<T>
    $apiGet: <T>(url: string, params?: any, config?: any) => Promise<T>
  }
}
