// utils/chartOptions.ts
import type { TypingRecord } from "~/types/typing"

export const getRecentCpmOptions = (typingRecords: TypingRecord[]) => ({
  title: {
    text: "Recent Cpm Statistics",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Avg CPM", "Max CPM"],
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
      name: "Max CPM",
      type: "line",
      data: typingRecords.map((item) => item.max_cpm),
    },
  ],
})

export const getRecentWpmOptions = (typingRecords: TypingRecord[]) => ({
  title: {
    text: "Recent Wpm Statistics",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Avg WPM", "Max WPM"],
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
      name: "Avg WPM",
      type: "line",
      data: typingRecords.map((item) => item.avg_wpm),
    },
    {
      name: "Max WPM",
      type: "line",
      data: typingRecords.map((item) => item.max_wpm),
    },
  ],
})

export const getEntireCpmOptions = (typingRecords: TypingRecord[]) => ({
  title: {
    text: "Recent Cpm Statistics",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Avg CPM", "Max CPM"],
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
      name: "Max CPM",
      type: "line",
      data: typingRecords.map((item) => item.max_cpm),
    },
  ],
})

export const getEntireWpmOptions = (typingRecords: TypingRecord[]) => ({
  title: {
    text: "Recent Wpm Statistics",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    data: ["Avg WPM", "Max WPM"],
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
      name: "Avg WPM",
      type: "line",
      data: typingRecords.map((item) => item.avg_wpm),
    },
    {
      name: "Max WPM",
      type: "line",
      data: typingRecords.map((item) => item.max_wpm),
    },
  ],
})

export const getRecentAccPrgOptions = (typingRecords: TypingRecord[]) => {
  const avgAccuracy = calcAvg(typingRecords, "avg_accuracy")
  const avgProgress = calcAvg(typingRecords, "avg_progress")

  const gaugeData = [
    {
      value: avgAccuracy,
      name: "Avg Accuracy",
      title: {
        offsetCenter: ["0%", "-20%"],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ["0%", "-10%"],
      },
    },
    {
      value: avgProgress,
      name: "Avg Progress",
      title: {
        offsetCenter: ["0%", "10%"],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ["0%", "20%"],
      },
    },
  ]

  return {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#464646",
          },
        },
        axisLine: {
          lineStyle: {
            width: 40,
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
        title: {
          fontSize: 14,
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: "inherit",
          borderColor: "inherit",
          borderRadius: 20,
          borderWidth: 1,
          formatter: "{value}%",
        },
      },
    ],
  }
}

export const getEntireAccPrgOptions = (typingRecords: TypingRecord[]) => {
  const avgAccuracy = calcAvg(typingRecords, "avg_accuracy")
  const avgProgress = calcAvg(typingRecords, "avg_progress")

  const gaugeData = [
    {
      value: avgAccuracy,
      name: "Avg Accuracy",
      title: {
        offsetCenter: ["0%", "-20%"],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ["0%", "-10%"],
      },
    },
    {
      value: avgProgress,
      name: "Avg Progress",
      title: {
        offsetCenter: ["0%", "10%"],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ["0%", "20%"],
      },
    },
  ]

  return {
    series: [
      {
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#464646",
          },
        },
        axisLine: {
          lineStyle: {
            width: 40,
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
        title: {
          fontSize: 14,
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: "inherit",
          borderColor: "inherit",
          borderRadius: 20,
          borderWidth: 1,
          formatter: "{value}%",
        },
      },
    ],
  }
}

// export const recentOtherInfoOptions = (typingRecords: Record[]) => ({
//   title: {
//     text: "Recent Other Options",
//   },
//   tooltip: {
//     trigger: "axis",
//   },
//   legend: {
//     data: [
//       "Avg CPM",
//       "Avg WPM",
//       "Max CPM",
//       "Max WPM",
//       "Avg Accuracy",
//       "Avg Progress",
//       "Sentence Count",
//       "Typing Time",
//       "Char Count",
//     ],
//   },
//   xAxis: {
//     type: "category",
//     data: typingRecords.map((item) => item.registered_date),
//   },
//   yAxis: {
//     type: "value",
//   },
//   series: [
//     {
//       name: "Avg CPM",
//       type: "line",
//       data: typingRecords.map((item) => item.avg_cpm),
//     },
//     {
//       name: "Avg WPM",
//       type: "line",
//       data: typingRecords.map((item) => item.avg_wpm),
//     },
//     {
//       name: "Max CPM",
//       type: "line",
//       data: typingRecords.map((item) => item.max_cpm),
//     },
//     {
//       name: "Max WPM",
//       type: "line",
//       data: typingRecords.map((item) => item.max_wpm),
//     },
//     {
//       name: "Avg Accuracy",
//       type: "line",
//       data: typingRecords.map((item) => item.avg_accuracy),
//     },
//     {
//       name: "Avg Progress",
//       type: "line",
//       data: typingRecords.map((item) => item.avg_progress),
//     },
//     {
//       name: "Sentence Count",
//       type: "line",
//       data: typingRecords.map((item) => item.count),
//     },
//     {
//       name: "Typing Time",
//       type: "line",
//       data: typingRecords.map((item) => item.time),
//     },
//     {
//       name: "Char Count",
//       type: "line",
//       data: typingRecords.map((item) => item.char_count),
//     },
//   ],
// })
