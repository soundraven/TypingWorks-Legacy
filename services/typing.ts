import type { FormInstance } from "element-plus"
import { $apiGet, $apiPost } from "~/services/api"
import type { RuleForm, Success } from "~/types/request"
import type { Sentence } from "~/types/sentence"

export const getSentence = async (
  oneCycle: number,
  targetLanguage: string,
  targetSentenceType: string,
): Promise<Sentence[] | undefined> => {
  try {
    const result = await $apiGet<Sentence[]>("/typing/sentence", {
      oneCycle: oneCycle,
      language: targetLanguage,
      type: targetSentenceType,
    })

    return result
  } catch (error: any) {
    ElMessage({ message: `"Error:", ${error.message}`, type: "error" })
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
      const result = await $apiPost<Success>("/typing/request", {
        form: ruleForm,
      })

      if (result) {
        ElMessage({
          message: "Successfully send your request",
          type: "success",
        })
        navigateTo("/typing/typewriter")
      }
    } else {
      ElMessage({ message: "Please input valid infomation", type: "error" })
    }
  })
}
