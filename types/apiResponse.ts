export interface autoLoginResponse {
  id: number
  nickname: string
}

export interface refreshTokenResult {
  user: autoLoginResponse
  accessToken: string
}
