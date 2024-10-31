import type { Dayjs } from "dayjs"

export interface TypingInfo {
  targetLanguage: string
  targetSentenceType: string
  avgWpm: number
  avgCpm: number
  maxWpm: number
  maxCpm: number
  avgAccuracy: number
  avgProgress: number
  count: number
  entireElapsedTime: number
  charCount: number
}

export interface Record {
  registered_by: number
  language: string
  type: string
  avg_wpm: number
  avg_cpm: number
  max_wpm: number
  max_cpm: number
  avg_accuracy: number
  avg_progress: number
  count: number
  time: number
  char_count: number
  registered_date: Dayjs
}

export enum TypoStatus {
  NotInput = 0,
  Correct = 1,
  Error = 2,
}

export enum Direction {
  Raise = "raise",
  Reduce = "reduce",
}

export interface Sentence {
  id: number
  content: string
  source: string
  language: "kr" | "en" | ""
  type: "quote" | "pangram" | ""
}

export interface Language {
  id: number
  name: string
  code: string
}

export interface Type {
  id: number
  name: string
  code: string
}

export interface SentenceInfo {
  languageInfo: Language[]
  typeInfo: Type[]
}

export interface Request {
  id: number
  requester: string
  language: string
  type: string | null
  other_type: boolean
  comment: string | null
  source: string
  sentence: string
  explanation: string | null
}
