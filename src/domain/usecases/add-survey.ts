import type { SurveyModel } from '@/domain/models'

export type AddSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (params: AddSurveyParams) => Promise<void>
}
