<template></template>
<script setup lang="ts">
import axios from "axios"

const route = useRoute()
const { $indexStore } = useNuxtApp()

const loading = ElLoading.service({
  lock: true,
  text: "Loading",
  background: "rgba(0, 0, 0, 0.7)",
})
setTimeout(() => {
  loading.close()
}, 1000)

// 카카오 인증 코드 확인 후 백엔드에 액세스 토큰 요청
onMounted(async () => {
  const code = route.query.code as string | undefined
  if (code) {
    try {
      const response = await axios.post(
        "http://localhost:8001/api/auth/kakaoToken",
        { code },
      )
      console.log("로그인 성공:", response.data)
      console.log("유저정보:", response.data.data.user.properties.nickname)
      ElMessage({ message: "로그인 성공", type: "success" })
      localStorage.setItem("accessToken", response.data.data.accessToken)
      sessionStorage.setItem(
        "user",
        response.data.data.user.properties.nickname,
      )
      $indexStore.user().login(response.data.data.user.properties.nickname)
      navigateTo("/typing/typewriter")
    } catch (error) {
      ElMessage({ message: "로그인 실패", type: "error" })
    }
  } else {
    ElMessage({ message: "인증 코드가 없습니다.", type: "error" })
  }
})
</script>
