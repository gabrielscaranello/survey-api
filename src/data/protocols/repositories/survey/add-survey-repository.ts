import type { AddSurveyParams } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (params: AddSurveyParams) => Promise<void>
}
