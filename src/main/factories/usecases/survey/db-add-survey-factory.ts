import type { AddSurvey } from '@/domain/usecases'

import { DbAddSurvey } from '@/data/usecases'
import { SurveyMongoRepository } from '@/infra/db/mongodb'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyRepository = new SurveyMongoRepository()

  return new DbAddSurvey(surveyRepository)
}
