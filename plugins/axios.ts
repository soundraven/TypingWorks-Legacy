import { defineNuxtPlugin } from "nuxt/app"
import axios, { type AxiosInstance } from "axios"

export default defineNuxtPlugin((nuxtApp) => {
  const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8001/api",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  api.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  nuxtApp.provide("axios", api)
})
