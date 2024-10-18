export const useUserStore = defineStore("user", () => {
  const user = {
    id: 0,
    nickname: "",
    isAuthenticated: false,
  }

  const login = (id: number, nickname: string) => {
    user.id = id
    user.nickname = nickname
    user.isAuthenticated = true
  }

  const logout = () => {
    user.nickname = ""
    user.isAuthenticated = false
  }

  return { user, login, logout }
})
