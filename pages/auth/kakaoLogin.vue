<template></template>
<script setup lang="ts">
import axios from "axios"
import Cookies from "js-cookie"

const route = useRoute()
const { $indexStore } = useNuxtApp()
const config = useRuntimeConfig()
const baseURL = config.public.API

const loading = ElLoading.service({
  lock: true,
  text: "Loading",
  background: "rgba(0, 0, 0, 0.7)",
})
setTimeout(() => {
  loading.close()
}, 1000)

onMounted(async () => {
  const code = route.query.code as string | undefined
  if (code) {
    try {
      const response = await axios.post(`${baseURL}/auth/kakaoLogin`, { code })

      ElMessage({ message: "로그인 성공", type: "success" })

      Cookies.set("accessToken", response.data.data.accessToken, {
        expires: 0.25,
      })
      Cookies.set("refreshToken", response.data.data.refreshToken, {
        expires: 60,
      })

      console.log(response.data.data.user.properties.nickname)

      $indexStore
        .user()
        .login(
          response.data.data.user.id,
          response.data.data.user.properties.nickname,
        )
    } catch (error) {
      ElMessage({ message: "로그인 실패", type: "error" })
    }
  } else {
    ElMessage({ message: "인증 코드가 없습니다.", type: "error" })
  }

  navigateTo("/typing/typewriter")
})
</script>
