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
  entireElapsedtime: number
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
