// utils/chartOptions.ts
import type { Record } from "~/types/typing"

export const getRecentTypingOptions = (typingRecords: Record[]) => ({
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
    data: typingRecords.map((item) => item.registered_date),
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Avg CPM",
      type: "line",
      data: typingRecords.map((item) => item.avg_cpm),
    },
    {
      name: "Avg WPM",
      type: "line",
      data: typingRecords.map((item) => item.avg_wpm),
    },
    {
      name: "Max CPM",
      type: "line",
      data: typingRecords.map((item) => item.max_cpm),
    },
    {
      name: "Max WPM",
      type: "line",
      data: typingRecords.map((item) => item.max_wpm),
    },
  ],
})
