<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <div :class="$style.menuContainer">
        <el-menu default-active="1-1-1" :class="$style.menu">
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
              <el-menu-item index="1-1-1" @click="handleMenuClick('1-1-1')">
                CPM
              </el-menu-item>
              <el-menu-item index="1-1-2" @click="handleMenuClick('1-1-2')">
                WPM
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="1-2" @click="handleMenuClick('1-2')">
              <template #title>
                <el-icon><Document /></el-icon>Other Info
              </template>
              <el-menu-item index="1-2-1" @click="handleMenuClick('1-2-1')">
                Acc & Prg
              </el-menu-item>
            </el-sub-menu>
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
              <el-menu-item index="2-1-1" @click="handleMenuClick('2-1-1')">
                CPM
              </el-menu-item>
              <el-menu-item index="2-1-2" @click="handleMenuClick('2-1-2')">
                WPM
              </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="2-2" @click="handleMenuClick('2-2')">
              <template #title>
                <el-icon><Document /></el-icon>Other Info
              </template>
              <el-menu-item index="2-2-1" @click="handleMenuClick('2-2-1')">
                Acc & Prg
              </el-menu-item>
            </el-sub-menu>
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
import type {
  EntireRecordResponse,
  RecentRecordResponse,
} from "~/types/apiResponse"
import type { TypingRecord } from "~/types/typing"
import type { EChartsOption } from "echarts"

const { $echarts } = useNuxtApp()

definePageMeta({ middleware: "kakao" })

const chart = ref(null)

const condition: Ref<string> = ref("recentCpm")

const recentTypingRecords: Ref<TypingRecord[]> = ref([])
const entireTypingRecords: Ref<TypingRecord[]> = ref([])

const menuMapping: Record<string, string> = {
  "1-1-1": "recentCpm",
  "1-1-2": "recentWpm",
  "1-2-1": "recentAccPrg",
  "2-1-1": "entireCpm",
  "2-1-2": "entireWpm",
  "2-2-1": "entireAccPrg",
}

const handleMenuClick = (index: string) => {
  condition.value = menuMapping[index] || ""
}

const getRecentRecord = async (userId: number) => {
  const response = await $apiGet<RecentRecordResponse>("/chart/recentRecord", {
    userId: userId,
  })

  recentTypingRecords.value = response.records
}

const getEntireRecord = async (userId: number) => {
  const response = await $apiGet<EntireRecordResponse>("/chart/entireRecord", {
    userId: userId,
  })

  entireTypingRecords.value = response.records
}

const chartOptions = computed(() => {
  switch (condition.value) {
    case "recentCpm":
      return getRecentCpmOptions(recentTypingRecords.value)
    case "recentWpm":
      return getRecentWpmOptions(recentTypingRecords.value)
    case "recentAccPrg":
      return getRecentAccPrgOptions(recentTypingRecords.value)
    case "entireCpm":
      return getEntireCpmOptions(entireTypingRecords.value)
    case "entireWpm":
      return getEntireWpmOptions(entireTypingRecords.value)
    case "entireAccPrg":
      return getEntireAccPrgOptions(entireTypingRecords.value)
    default:
      return {} as EChartsOption
  }
})

let myChart: echarts.ECharts | null = null

onMounted(async () => {
  const userJson = sessionStorage.getItem("user")
  if (userJson) {
    const user = JSON.parse(userJson)

    await Promise.all([getRecentRecord(user.id), getEntireRecord(user.id)])

    if (chart.value) {
      myChart = $echarts.init(chart.value)
      myChart.setOption(chartOptions.value)
    }
  } else {
    ElMessage({ message: "Please use kakao login first.", type: "warning" })
    return navigateTo("/typing/typewriter", { replace: true })
  }
})

watch(chartOptions, (newOptions) => {
  if (myChart && newOptions) {
    myChart.setOption(newOptions, true)
  }
})
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

    border: 2px solid var(--border-color);
    border-radius: 10px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);

    display: flex;

    padding: 12px;

    > .menuContainer {
      width: 250px;
      height: 100%;

      > .menu {
        border-right: none;
      }
    }

    > .chartContainer {
      width: 100%;
      padding-inline: 12px;
    }
  }
}
</style>
