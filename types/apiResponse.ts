import type { Record, Request } from "~/types/typing"
import type { User } from "~/types/user"

export interface autoLoginResponse {
  user: User
}

export interface refreshTokenResponse {
  user: User
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

export interface RecentRecordResponse {
  records: Record[]
}

export interface EntireRecordResponse {
  records: Record[]
}

export interface SubmitFormResponse {
  success: boolean
}

export interface KakaoLoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: number
    properties: {
      nickname: string
    }
  }
}
