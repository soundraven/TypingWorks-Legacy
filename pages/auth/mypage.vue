<template>
  <div :class="$style.index">
    <div :class="$style.container">
      <div :class="$style.menuContainer">
        <el-menu
          default-active="1"
          :class="$style.menu"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>Navigator One</span>
            </template>
            <el-menu-item-group title="Group One">
              <el-menu-item index="1-1">item one</el-menu-item>
              <el-menu-item index="1-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="1-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <span>Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <el-icon><document /></el-icon>
            <span>Navigator Three</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span>Navigator Four</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div :class="$style.chartContainer">
        <div ref="chart" style="width: 100%; height: 400px"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $apiGet } from "~/services/api"
import type { RecentRecordResponse } from "~/types/apiResponse"
import type { Record } from "~/types/typing"

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

onMounted(async () => {
  const userJson = sessionStorage.getItem("user")
  if (userJson) {
    const user = JSON.parse(userJson)

    await getRecentRecord(user.id)

    if (chart.value) {
      const myChart = $echarts.init(chart.value)

      const option = {
        title: {
          text: "Recent Typing Statistics",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Avg CPM", "Avg WPM", "Max CPM", "Max WPM"],
        },
        xAxis: {
          type: "category",
          data: typingRecords.value.map((item) => item.registered_date),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Avg CPM",
            type: "line",
            data: typingRecords.value.map((item) => item.avg_cpm),
          },
          {
            name: "Avg WPM",
            type: "line",
            data: typingRecords.value.map((item) => item.avg_wpm),
          },
          {
            name: "Max CPM",
            type: "line",
            data: typingRecords.value.map((item) => item.max_cpm),
          },
          {
            name: "Max WPM",
            type: "line",
            data: typingRecords.value.map((item) => item.max_wpm),
          },
        ],
      }

      myChart.setOption(option)
    }
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
