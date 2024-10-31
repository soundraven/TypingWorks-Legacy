// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/getting-started/configuration#nuxt-configuration
// import type { MyEnv } from "~/structure/env"
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          as: "style",
          crossorigin: "anonymous",
          href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
        },
      ],
    },
  },

  devtools: { enabled: true },

  build: {
    transpile: ["@popperjs/core"],
  },

  runtimeConfig: {
    // 외부에 선언될 경우 서버에서만 사용 가능
    // SECRET_KEY: process.env.SECRET_KEY,
    // public에 들어가면 클라이언트에서 확인이 가능
    public: {
      API: process.env.API_URL,
      PUBLIC_PATH: "/_nuxt/",
      KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY,
      REDIRECT_URI: process.env.REDIRECT_URI,
      ADMIN_ID: process.env.ADMIN_ID,
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '@/assets/css/utils/global.scss';",
        },
      },
    },
  },

  css: ["~/assets/css/main.scss"],

  modules: [
    "@element-plus/nuxt",
    // "@nuxtjs/eslint-module",
    "@vueuse/nuxt", // https://vueuse.org/guide/#nuxt
    "@pinia/nuxt", // https://pinia.vuejs.org/ssr/nuxt.html
    "@nuxtjs/color-mode", // https://color-mode.nuxtjs.org/
    "@formkit/auto-animate/nuxt", // https://auto-animate.formkit.com/#usage-vue
    "nuxt-icon", //https://nuxt.com/modules/icon
  ],

  colorMode: {
    preference: "light", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "-mode",
    storageKey: "nuxt-color-mode",
  },

  compatibilityDate: "2024-10-08",
})
