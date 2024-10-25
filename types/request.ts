export interface RuleForm {
  requester: string
  language: string
  sentenceType: string
  otherSentenceType: boolean
  comment?: string
  source: string
  sentence: string
  explanation: string
}

export interface Success {
  success: boolean
}
