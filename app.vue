<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import Cookies from "js-cookie"
const { $indexStore } = useNuxtApp()
onMounted(() => {
  const accessToken = Cookies.get("accessToken")
  const refreshToken = Cookies.get("refreshToken")

  if (accessToken || refreshToken) {
    $indexStore.user().me()
  }
})
</script>
