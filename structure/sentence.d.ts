interface Quote {
  person: string
  quote: string
}

interface TypingInfo {
  targetLanguage: Language
  targetQuoteType: QuoteType
  avgWpm: number
  avgCpm: number
  maxWpm: number
  maxCpm: number
  avgAccuracy: number
  avgProgress: number
  count: number
  entireElapsedtime: number
}
enum TypoStatus {
  NotInput = 0,
  Correct = 1,
  Error = 2,
}
enum Language {
  Korean = "Ko",
  English = "En",
}

enum QuoteType {
  LifeQuote = "LifeQuote",
  Pangram = "Pangram",
}
enum Direction {
  Raise = "raise",
  Reduce = "reduce",
}

interface Sentence {
  id: number
  content: string
  source: string
}

export {
  Sentence,
  Direction,
  QuoteType,
  Language,
  TypoStatus,
  TypingInfo,
  Quote,
}
