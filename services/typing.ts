import type { FormInstance } from "element-plus"
import { $apiGet, $apiPost } from "~/services/api"
import type { SubmitFormResponse } from "~/types/apiResponse"
import type { RuleForm } from "~/types/request"
import type { Sentence } from "~/types/typing"

export const getSentence = async (
  oneCycle: number,
  targetLanguage: string,
  targetSentenceType: string,
): Promise<Sentence[] | undefined> => {
  try {
    const response = await $apiGet<Sentence[]>("/typing/sentence", {
      oneCycle: oneCycle,
      language: targetLanguage,
      type: targetSentenceType,
    })

    return response
  } catch (error: any) {
    ElMessage({ message: error.message, type: "error" })
    return undefined
  }
}

export const submitForm = async (
  formEl: FormInstance | undefined,
  ruleForm: RuleForm,
): Promise<void> => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const response = await $apiPost<SubmitFormResponse>("/typing/request", {
          form: ruleForm,
        })

        ElMessage({
          message: "Successfully send your request",
          type: "success",
        })

        navigateTo("/typing/typewriter")
      } catch (error: any) {
        ElMessage({ message: error.message, type: "error" })
      }
    } else {
      ElMessage({ message: "Please input valid information", type: "error" })
    }
  })
}
