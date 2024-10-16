<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <div :class="$style.form">
        <el-form
          ref="ruleFormRef"
          style="min-width: 540px"
          :model="ruleForm"
          :rules="rules"
          label-width="auto"
          status-icon
        >
          <el-form-item label="Contributor" prop="name" label-position="left">
            <el-input
              v-model="ruleForm.name"
              type="textarea"
              resize="none"
              :rows="1"
              :input-style="{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--color)',
                border: '1px solid var(--border-color)',
              }"
              placeholder="신청자의 이름을 작성해주세요"
              maxlength="12"
            />
          </el-form-item>
          <el-form-item label="Language" prop="language" label-position="left">
            <el-segmented
              v-model="ruleForm.language"
              :options="$indexStore.sentenceInfo().languageNames"
            />
          </el-form-item>
          <el-form-item
            label="Sentence Type"
            prop="sentenceType"
            label-position="left"
          >
            <el-segmented
              v-model="ruleForm.sentenceType"
              :options="$indexStore.sentenceInfo().typeNames"
            />
          </el-form-item>
          <el-form-item label="Other type" label-position="left">
            <el-switch v-model="ruleForm.otherSentenceType" />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.otherSentenceType"
            label="comment"
            prop="comment"
            label-position="left"
          >
            <el-input
              v-model="ruleForm.comment"
              type="textarea"
              resize="none"
              autosize
              :input-style="{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--color)',
                border: '1px solid var(--border-color)',
              }"
              placeholder="추가를 원하는 문장의 유형을 간단히 작성해주세요"
              maxlength="64"
            />
          </el-form-item>
          <el-form-item label="Source" prop="source" label-position="left">
            <el-input
              v-model="ruleForm.source"
              type="textarea"
              resize="none"
              :rows="1"
              :input-style="{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--color)',
                border: '1px solid var(--border-color)',
              }"
              placeholder="문장의 출처를 작성해주세요"
              maxlength="32"
            />
          </el-form-item>
          <el-form-item label="Sentence" prop="sentence" label-position="left">
            <el-input
              v-model="ruleForm.sentence"
              type="textarea"
              resize="none"
              autosize
              :input-style="{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--color)',
                border: '1px solid var(--border-color)',
              }"
              placeholder="문장을 작성해주세요"
              maxlength="64"
            />
          </el-form-item>
          <el-form-item
            label="Explanation"
            prop="explanation"
            label-position="left"
            class="custom-label"
          >
            <el-input
              v-model="ruleForm.explanation"
              type="textarea"
              resize="none"
              autosize
              :input-style="{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--color)',
                border: '1px solid var(--border-color)',
              }"
              placeholder="문장에 대한 설명을 작성해주세요(선택)"
              maxlength="64"
            />
          </el-form-item>
          <div :class="$style.btn">
            <el-button type="primary" @click="submitForm(ruleFormRef)">
              Submit
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus"

const { $indexStore } = useNuxtApp()

onMounted(async () => {
  $indexStore.sentenceInfo().getSentenceInfo()
})

interface RuleForm {
  name: string
  language: string
  sentenceType: string
  otherSentenceType: boolean
  comment?: string
  source: string
  sentence: string
  explanation: string
}

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  name: "",
  language: "",
  sentenceType: "",
  otherSentenceType: false,
  comment: "",
  source: "",
  sentence: "",
  explanation: "",
})

const rules = computed(
  (): FormRules<RuleForm> => ({
    name: [
      { required: true, message: "Please input your name", trigger: "blur" },
      { min: 2, max: 12, message: "Length should be 2 to 12", trigger: "blur" },
    ],
    language: [
      {
        required: true,
        message: "Please select a language",
        trigger: "change",
      },
    ],
    sentenceType: [
      {
        required: !ruleForm.otherSentenceType,
        message: "Please select a sentence type",
        trigger: "change",
      },
    ],
    comment: [
      {
        required: true,
        message: "Please input your request",
        trigger: "blur",
      },
      { min: 2, max: 64, message: "Length should be 2 to 64", trigger: "blur" },
    ],
    source: [
      {
        required: true,
        message: "Please input source of sentence",
        trigger: "blur",
      },
      { min: 2, max: 32, message: "Length should be 2 to 32", trigger: "blur" },
    ],
    sentence: [
      {
        required: true,
        message: "Please input your sentence",
        trigger: "blur",
      },
      { min: 2, max: 64, message: "Length should be 2 to 64", trigger: "blur" },
    ],
    explanation: [
      {
        message: "Please input explanation of sentence",
        trigger: "blur",
      },
      { min: 2, max: 64, message: "Length should be 2 to 64", trigger: "blur" },
    ],
  }),
)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!")
    } else {
      console.log("error submit!", fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style lang="scss" module>
.index {
  min-height: 100dvh;
  display: flex;
  justify-content: center;

  > .container {
    width: 660px;
    min-height: 480px;

    display: flex;
    justify-content: center;

    background-color: var(--bg-secondary);

    border: 1px solid var(--border-color);
    border-radius: 10px;

    padding: 12px;
    margin-block: auto;

    > .form {
      width: 100%;

      display: flex;
      justify-content: center;
      align-items: center;

      background-color: var(--bg);

      border: 1px solid var(--border-color);
      border-radius: 10px;

      padding: 12px;

      .btn {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
