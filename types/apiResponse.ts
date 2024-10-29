import type { Request } from "~/types/typing"

export interface autoLoginResponse {
  id: number
  nickname: string
}

export interface refreshTokenResponse {
  user: autoLoginResponse
  accessToken: string
}

export interface RequestListResponse {
  requestList: Request[]
}

export interface ConfirmResponse {
  success: boolean
}

export interface RecordResponse {
  success: boolean
}
