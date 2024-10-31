<template></template>
<script setup lang="ts">
import { kakaoLogin } from "~/services/auth"

const route = useRoute()

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
    kakaoLogin(code)
  } else {
    ElMessage({ message: "There's no validation code.", type: "error" })
  }
  navigateTo("/typing/typewriter")
})
</script>
