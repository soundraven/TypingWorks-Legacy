export default defineNuxtRouteMiddleware((to, from) => {
  const { $indexStore } = useNuxtApp()

  if (!$indexStore.user().user.isAuthenticated) {
    ElMessage({ message: "Please use kakao login first.", type: "warning" })
    return navigateTo(from.fullPath)
  }
})
