import type { FormInstance } from "element-plus"
import { $apiPost } from "~/services/api"
import type { RuleForm } from "~/types/request"

export const submitForm = async (
  formEl: FormInstance | undefined,
  ruleForm: RuleForm,
): Promise<void> => {
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await $apiPost<boolean>("/typing/request", {
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
