interface Answer {
  image?: string
  answer: string
}

export interface AddSurveyRequest {
  question: string
  answers: Answer[]
}
