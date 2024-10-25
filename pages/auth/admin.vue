<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <ClientOnly>
        <el-table :data="requestList" :highlight-current-row="true">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="requester" label="신청자"></el-table-column>
          <el-table-column prop="langauge" label="언어"></el-table-column>
          <el-table-column
            prop="sentenseType"
            label="문장 유형"
          ></el-table-column>
          <el-table-column
            prop="otherSentenceType"
            label="새 유형 신청"
          ></el-table-column>
          <el-table-column prop="comment" label="신청한 유형"></el-table-column>
          <el-table-column prop="source" label="문장 출처"></el-table-column>
          <el-table-column prop="sentence" label="문장 내용"></el-table-column>
          <el-table-column prop="explanation" label="설명"></el-table-column>
        </el-table>
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $apiGet } from "~/services/api"
import type { RequestListResponse } from "~/types/apiResponse"
import type { Request } from "~/types/sentence"
const { $indexStore } = useNuxtApp()

const requestList: Ref<Request[]> = ref([])

onMounted(async () => {
  const response = await $apiGet<RequestListResponse>("/auth/admin")
  console.log("API결과", response)
  requestList.value = response.requestList
})
</script>

<style lang="scss" module>
.index {
  min-height: 100dvh;
  display: flex;
  justify-content: center;

  > .container {
    width: 1000px;
    min-height: 600px;

    display: flex;
    justify-content: center;

    background-color: var(--bg-secondary);

    border: 1px solid var(--border-color);
    border-radius: 10px;

    padding: 12px;
    margin-block: auto;
  }
}
</style>
