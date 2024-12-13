<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <ClientOnly>
        <el-table
          :data="paginatedRequestList"
          :highlight-current-row="true"
          :class="$style.table"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div style="margin: 12px">
                <p>언어: {{ props.row.language }}</p>
                <p>문장 유형: {{ props.row.type }}</p>
                <p>출처: {{ props.row.source }}</p>
                <p>문장: {{ props.row.sentence }}</p>
                <p v-if="props.row.explanation !== null">
                  설명: {{ props.row.explanation }}
                </p>
                <p v-if="props.row.other_type === 'Y'">
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
                active-value="Y"
                inactive-value="N"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column label="확인" align="center">
            <template #default="props" v-if="isAdmin">
              <el-button
                type="success"
                icon="Check"
                circle
                @click="confirm('accept', props.row.id)"
              />
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="confirm('reject', props.row.id)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="requestList.length"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          :class="$style.pagination"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $apiPost } from "~/services/api"
import { getRequestList } from "~/services/auth"
import type { ConfirmResponse } from "~/types/apiResponse"
import type { Request } from "~/types/typing"
const { $indexStore } = useNuxtApp()

const config = useRuntimeConfig()
const ADMIN_ID = Number(config.public.ADMIN_ID)
const isAdmin = computed(() => $indexStore.user().user.id === ADMIN_ID)

const requestList: Ref<Request[]> = ref([])
const currentPage: Ref<number> = ref(1)
const pageSize: Ref<number> = ref(20)

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const paginatedRequestList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return requestList.value.slice(start, start + pageSize.value)
})

onMounted(async () => {
  try {
    requestList.value = await getRequestList()
  } catch (error: any) {
    ElMessage.error(error.message || "Failed to fetch request list.")
  }
})
type Status = "accept" | "reject"

const confirm = async (status: Status, id: number) => {
  try {
    const response = await $apiPost<ConfirmResponse>("/auth/confirm", {
      status: status,
      requestId: id,
    })

    if (response?.success) {
      requestList.value = requestList.value.filter(
        (request) => request.id !== id,
      )
      ElMessage.success(`ID: ${id}, Successfully confirmed.`)
    }
  } catch (error: any) {
    ElMessage.error(error.message || "Confirm failure")
  }
}

watch(
  () => requestList.value.length,
  (newLength) => {
    if (
      newLength > 0 &&
      currentPage.value > Math.ceil(newLength / pageSize.value)
    ) {
      currentPage.value -= 1
    }
  },
)
</script>

<style lang="scss" module>
.index {
  min-height: 100dvh;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 12px;

  > .container {
    width: 650px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: var(--bg-secondary);

    border: 1px solid var(--border-color);
    border-radius: 10px;

    padding: 12px;

    > .table {
      border-radius: 10px;

      p {
        margin-top: 0;
        margin-bottom: 6px;
      }
    }

    > .pagination {
      margin-top: 12px;
    }
  }
}
</style>
