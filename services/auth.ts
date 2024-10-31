import Cookies from "js-cookie"
import { $apiGet, $apiPost } from "~/services/api"
import type {
  KakaoLoginResponse,
  RequestListResponse,
} from "~/types/apiResponse"
import type { Request } from "~/types/typing"

export const kakaoLogin = async (code: string) => {
  const { $indexStore } = useNuxtApp()
  try {
    const response = await $apiPost<KakaoLoginResponse>("/auth/kakaoLogin", {
      code,
    })

    ElMessage({ message: "로그인 성공", type: "success" })

    Cookies.set("accessToken", response.accessToken, {
      expires: 0.25,
    })
    Cookies.set("refreshToken", response.refreshToken, {
      expires: 60,
    })

    $indexStore
      .user()
      .login(response.user.id, response.user.properties.nickname)
  } catch (error) {
    ElMessage({ message: "Login failure.", type: "error" })
  }
}

export const getRequestList = async (): Promise<Request[]> => {
  const response = await $apiGet<RequestListResponse>("/auth/admin")
  return response.requestList
}
