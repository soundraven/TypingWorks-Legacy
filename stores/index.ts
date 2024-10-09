import { defineStore } from "pinia"
import { useTypingStore } from "./typing"

export const useIndexStore = defineStore("index", () => {
  const typing = () => {
    return useTypingStore()
  }

  return {
    typing,
  }
})
