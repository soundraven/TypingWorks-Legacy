export default defineNuxtRouteMiddleware((to, from) => {
  const { $indexStore } = useNuxtApp()

  if (!$indexStore.user().user.isAuthenticated) {
    ElMessage({ message: "Please use kakao login.", type: "warning" })
    return navigateTo(from.fullPath)
  }
})
