import { TypoStatus, type Record } from "~/types/typing"

export const getPercentage = (
  numerator: number,
  denominator: number,
): number => {
  if (numerator === 0) return 0
  return Math.round((numerator / denominator) * 100)
}

export const calcSpeed = (words: number, time: number): number => {
  return Math.round((words / time) * 60)
}

export const calcAccuracy = (typoStatus: TypoStatus[]) => {
  const typoCount: number = typoStatus.filter(
    (value: TypoStatus) => value === TypoStatus.Error,
  ).length

  return getPercentage(typoStatus.length - typoCount, typoStatus.length)
}

export const calcProgress = (parsingText: string, targetSentence: string) => {
  return getPercentage(
    parsingText.split("").length,
    targetSentence.split("").length,
  )
}

export const getAvgValue = (array: number[]) => {
  const avg = Math.floor(
    array.reduce((acc, cur) => acc + cur, 0) / array.length,
  )
  return avg
}

export const getElapsedTime = (elapsedTime: number): string => {
  if (elapsedTime === 0) {
    return `${0}분 ${0}초`
  }

  const min: number = Math.floor(elapsedTime / 60)
  const sec: number = elapsedTime % 60

  return `${min}분 ${sec}초`
}

export const calcAvg = (typingRecords: Record[], field: string) => {
  const total = typingRecords.reduce((sum, record) => sum + record[field], 0)
  return total / typingRecords.length
}
