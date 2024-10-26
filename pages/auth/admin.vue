<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <ClientOnly>
        <el-table :data="requestList" :highlight-current-row="true">
          <el-table-column type="expand">
            <template #default="props">
              <div style="margin: 12px">
                <p style="margin-top: 0; margin-bottom: 6px">
                  언어: {{ props.row.language }}
                </p>
                <p style="margin-top: 0; margin-bottom: 6px">
                  문장 유형: {{ props.row.type }}
                </p>
                <p style="margin-top: 0; margin-bottom: 6px">
                  출처: {{ props.row.source }}
                </p>
                <p style="margin-top: 0; margin-bottom: 6px">
                  문장: {{ props.row.sentence }}
                </p>
                <p
                  v-if="props.row.explanation !== null"
                  style="margin-top: 0; margin-bottom: 6px"
                >
                  설명: {{ props.row.explanation }}
                </p>
                <p
                  v-if="props.row.other_type === 1"
                  style="margin-top: 0; margin-bottom: 6px"
                >
                  신청한 유형: {{ props.row.comment }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="requester"
            label="신청자"
            align="center"
          ></el-table-column>
          <el-table-column prop="other_type" label="새 유형" align="center">
            <template #default="props">
              <el-switch
                v-model="props.row.other_type"
                inline-prompt
                active-icon="Check"
                inactive-icon="Close"
                disabled
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="확인" align="center">
            <div>
              <el-button type="success" icon="Check" circle />
              <el-button type="danger" icon="Delete" circle />
            </div>
          </el-table-column>
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
  padding: 12px;

  > .container {
    width: 650px;
    min-height: 100dvh;

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
