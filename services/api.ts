export const $apiPost = async <T>(
  url: string,
  data: any,
  config?: any,
): Promise<T> => {
  const { $axios } = useNuxtApp()

  try {
    const result = await $axios.post<T>(url, data, config)

    return result.data
  } catch (error: any) {
    throw new Error(error.result?.data?.message || error.message)
  }
}

export const $apiGet = async <T>(
  url: string,
  params?: any,
  config?: any,
): Promise<T> => {
  const { $axios } = useNuxtApp()

  try {
    const result = await $axios.get<T>(url, {
      params,
      ...config,
    })

    console.log("$apiGet결과", result)

    return result.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}
