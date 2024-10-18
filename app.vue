<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { $indexStore } = useNuxtApp()
onMounted(() => {
  $indexStore.user().me()
})
</script>
