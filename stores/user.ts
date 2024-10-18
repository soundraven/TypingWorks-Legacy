import Cookies from "js-cookie"
import axios from "axios"

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

  const me = async () => {
    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    if (accessToken) {
      try {
        const user = await axios.post("/auth/me", {
          accessToken: accessToken,
        })

        if (user.data.data) {
          login(user.data.data.id, user.data.data.user.properties.nickname)
          console.log("자동로그인성공")
          return
        }
      } catch (error) {
        console.error("자동 로그인 실패:", error)
      }
    } else if (refreshToken) {
      try {
        const getTokenResult = await axios.post("/auth/me", {
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
          console.log("자동로그인성공")
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
