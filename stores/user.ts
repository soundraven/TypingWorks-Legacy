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
  }

  const logout = (): void => {
    user.value.id = 0
    user.value.nickname = ""
    user.value.isAuthenticated = false
    Cookies.remove("accessToken")
    Cookies.remove("refreshToken")
  }

  const me = async (): Promise<void> => {
    const { $indexStore } = useNuxtApp()
    const accessToken = Cookies.get("accessToken")
    const refreshToken = Cookies.get("refreshToken")

    if (accessToken) {
      try {
        const user = await $apiPost<autoLoginResponse>("/auth/me", {
          accessToken: accessToken,
        })

        if (user) {
          login(user.id, user.nickname)
          console.log($indexStore.user().user)
          return
        }
      } catch (error) {
        console.error("자동 로그인 실패:", error)
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
