<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <div :class="$style.menuContainer">
        <el-menu
          default-active="1-1-1"
          :class="$style.menu"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <span>
                <el-icon><Calendar /></el-icon>최근 기록
              </span>
            </template>
            <el-sub-menu index="1-1">
              <template #title>
                <el-icon><Stopwatch /></el-icon>Typing Speed
              </template>
              <el-menu-item index="1-1-1">CPM</el-menu-item>
              <el-menu-item index="1-1-2">WPM</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="1-2">
              <el-icon><Document /></el-icon>Other Info
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>전체 기록</span>
            </template>
            <el-sub-menu index="2-1">
              <template #title>
                <el-icon><Stopwatch /></el-icon>Typing Speed
              </template>
              <el-menu-item index="2-1-1">CPM</el-menu-item>
              <el-menu-item index="2-1-2">WPM</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="2-2">
              <el-icon><Document /></el-icon>Other Info
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div :class="$style.chartContainer">
        <div ref="chart" style="width: 100%; height: 800px"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $apiGet } from "~/services/api"
import type { RecentRecordResponse } from "~/types/apiResponse"
import type { Record } from "~/types/typing"
import { getRecentTypingOptions } from "~/utils/chartOptions"

const { $echarts } = useNuxtApp()

definePageMeta({ middleware: "kakao" })

const chart = ref(null)

const typingRecords: Ref<Record[]> = ref([])

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const getRecentRecord = async (userId: number) => {
  console.log(userId, "현재 query")
  const response = await $apiGet<RecentRecordResponse>("/chart/recentRecord", {
    userId: userId,
  })
  console.log(response.records)
  typingRecords.value = response.records
}

const chartOptions = computed(() => getRecentTypingOptions(typingRecords.value))

onMounted(async () => {
  const userJson = sessionStorage.getItem("user")
  if (userJson) {
    const user = JSON.parse(userJson)

    await getRecentRecord(user.id)

    if (chart.value) {
      const myChart = $echarts.init(chart.value)
      console.log(chartOptions.value)

      myChart.setOption(chartOptions.value)
    }
  }
})

// const option = {
//         title: {
//           text: "Recent Typing Statistics",
//         },
//         tooltip: {
//           trigger: "axis",
//         },
//         legend: {
//           data: [
//             "Avg CPM",
//             "Avg WPM",
//             "Max CPM",
//             "Max WPM",
//             "Avg Accuracy",
//             "Avg Progress",
//             "Sentence Count",
//             "Typing Time",
//             "Char Count",
//           ],
//         },
//         xAxis: {
//           type: "category",
//           data: typingRecords.value.map((item) => item.registered_date),
//         },
//         yAxis: {
//           type: "value",
//         },
//         series: [
//           {
//             name: "Avg CPM",
//             type: "line",
//             data: typingRecords.value.map((item) => item.avg_cpm),
//           },
//           {
//             name: "Avg WPM",
//             type: "line",
//             data: typingRecords.value.map((item) => item.avg_wpm),
//           },
//           {
//             name: "Max CPM",
//             type: "line",
//             data: typingRecords.value.map((item) => item.max_cpm),
//           },
//           {
//             name: "Max WPM",
//             type: "line",
//             data: typingRecords.value.map((item) => item.max_wpm),
//           },
//           {
//             name: "Avg Accuracy",
//             type: "line",
//             data: typingRecords.value.map((item) => item.avg_accuracy),
//           },
//           {
//             name: "Avg Progress",
//             type: "line",
//             data: typingRecords.value.map((item) => item.avg_progress),
//           },
//           {
//             name: "Sentence Count",
//             type: "line",
//             data: typingRecords.value.map((item) => item.count),
//           },
//           {
//             name: "Typing Time",
//             type: "line",
//             data: typingRecords.value.map((item) => item.time),
//           },
//           {
//             name: "Char Count",
//             type: "line",
//             data: typingRecords.value.map((item) => item.char_count),
//           },
//         ],
//       }
</script>

<style lang="scss" module>
.index {
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;

  > .container {
    width: 1340px;
    height: 800px;

    border: 1px solid var(--border-color);

    display: flex;

    > .menuContainer {
      width: 250px;
      height: 100%;

      > .menu {
      }
    }

    > .chartContainer {
      width: 100%;
    }
  }
}
</style>
