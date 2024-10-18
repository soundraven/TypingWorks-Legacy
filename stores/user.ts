import Cookies from "js-cookie"
import axios from "axios"

export const useUserStore = defineStore("user", () => {
  const user = ref({
    id: 0,
    nickname: "",
    isAuthenticated: false,
  })

  const login = (id: number, nickname: string) => {
    user.value.id = id
    user.value.nickname = nickname
    user.value.isAuthenticated = true
  }

  const logout = () => {
    user.value.id = 0
    user.value.nickname = ""
    user.value.isAuthenticated = false
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
  }

  const me = async () => {
    const config = useRuntimeConfig()
    const baseURL = config.public.API

    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    if (accessToken) {
      try {
        const user = await axios.post(`${baseURL}/auth/me`, {
          accessToken: accessToken,
        })

        if (user.data.data) {
          login(user.data.data.id, user.data.data.user.properties.nickname)
          return
        }
      } catch (error) {
        console.error("자동 로그인 실패:", error)
      }
    } else if (refreshToken) {
      try {
        const getTokenResult = await axios.post(`${baseURL}/auth/me`, {
          refreshToken: refreshToken,
        })

        if (getTokenResult.data.data) {
          Cookies.set("accessToken", getTokenResult.data.data.accessToken, {
            expires: 0.25,
          })
          login(
            getTokenResult.data.data.user.id,
            getTokenResult.data.data.user.properties.nickname,
          )
          return
        }
      } catch (error) {
        console.error("자동 로그인 실패:", error)
      }
    } else {
      ElMessage({
        message: "로그인 정보가 없습니다. 다시 로그인해 주세요.",
        type: "error",
      })
    }
  }

  return { user, login, logout, me }
})
