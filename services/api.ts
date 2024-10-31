export const $apiPost = async <T>(
  url: string,
  data: any,
  config: any = {},
): Promise<T> => {
  const { $axios } = useNuxtApp()

  try {
    const response = await $axios.post<T>(url, data, config)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export const $apiGet = async <T>(
  url: string,
  params: Record<string, any> = {},
  config: any = {},
): Promise<T> => {
  const { $axios } = useNuxtApp()

  try {
    const response = await $axios.get<T>(url, {
      params,
      ...config,
    })

    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}
