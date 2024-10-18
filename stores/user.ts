export const useUserStore = defineStore("user", () => {
  const user = {
    nickname: "",
    isAuthenticated: false,
  }

  const login = (nickname) => {
    user.nickname = nickname
    user.isAuthenticated = true
  }

  const logout = () => {
    user.nickname = ""
    user.isAuthenticated = false
  }

  return { user, login, logout }
})
