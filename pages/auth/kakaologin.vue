<template>
  <div>카카오 로그인 페이지</div>
</template>
<script setup lang="ts">
import axios from "axios"

const route = useRoute()

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
      ElMessage({ message: "로그인 성공", type: "success" })
      localStorage.setItem("accessToken", response.data.data)
    } catch (error) {
      ElMessage({ message: "로그인 실패", type: "error" })
    }
  } else {
    ElMessage({ message: "인증 코드가 없습니다.", type: "error" })
  }
})
</script>
