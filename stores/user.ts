import Cookies from "js-cookie"
import axios from "axios"
import type { User } from "~/types/user"

export const useUserStore = defineStore("user", () => {
  const user: Ref<User> = ref({
    id: 0,
    nickname: "",
    isAuthenticated: false,
  })

  const login = (id: number, nickname: string): void => {
    user.value.id = id
    user.value.nickname = nickname
    user.value.isAuthenticated = true
  }

  const logout = () => {
    user.value.id = 0
    user.value.nickname = ""
    user.value.isAuthenticated = false
  }

  const me = async (): Promise<void> => {
    const config = useRuntimeConfig()
    const baseURL = config.public.API

    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    if (accessToken) {
      try {
        const user = await axios.post(`${baseURL}/auth/me`, {
          accessToken: accessToken,
        })

        console.log(user)
        console.log(user.data)
        console.log(user.data.data.user)
        console.log(user.data.data.user.properties)
        console.log(user.data.data.user.properties.nickname)

        if (user.data.data) {
          login(user.data.data.id, user.data.data.user.properties.nickname)
          console.log("액세스토큰으로자동로그인성공")
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
          console.log("액세스토큰생성자동로그인성공")
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
