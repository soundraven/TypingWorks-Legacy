export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    return
  }

  if (!sessionStorage.getItem("user")) {
    ElMessage({ message: "Please use kakao login first.", type: "warning" })
    return navigateTo("/typing/typewriter")
  }
})
