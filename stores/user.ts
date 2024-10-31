import Cookies from "js-cookie"
import type { User } from "~/types/user"
import { $apiPost } from "~/services/api"
import type {
  autoLoginResponse,
  refreshTokenResponse,
} from "~/types/apiResponse"

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

    sessionStorage.setItem("user", JSON.stringify(user.value))
  }

  const logout = (): void => {
    user.value.id = 0
    user.value.nickname = ""
    user.value.isAuthenticated = false
    sessionStorage.removeItem("user")
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
  }

  const me = async (): Promise<void> => {
    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    if (accessToken) {
      try {
        const response = await $apiPost<autoLoginResponse>("/auth/me", {
          accessToken: accessToken,
        })

        if (response) {
          login(response.user.id, response.user.nickname)
          return
        }
      } catch (error: any) {
        ElMessage({ message: error.message, type: "error" })
      }
    } else if (refreshToken) {
      try {
        const refreshTokenResponse = await $apiPost<refreshTokenResponse>(
          "/auth/me",
          {
            refreshToken: refreshToken,
          },
        )

        if (refreshTokenResponse) {
          Cookies.set("accessToken", refreshTokenResponse.accessToken, {
            expires: 0.25,
          })

          login(
            refreshTokenResponse.user.id,
            refreshTokenResponse.user.nickname,
          )

          return
        }
      } catch (error: any) {
        ElMessage({ message: error.message, type: "error" })
      }
    } else {
      ElMessage({
        message: "There's no login info. Please login first.",
        type: "error",
      })
      logout()
    }
  }

  return { user, login, logout, me }
})
