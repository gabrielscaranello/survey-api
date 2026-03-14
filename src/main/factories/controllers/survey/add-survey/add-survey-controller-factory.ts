import type { Controller } from '@/presentation/protocols'

import { makeDbAddSurvey, makeErrorLogDecorator } from '@/main/factories'
import { AddSurveyController } from '@/presentation/controllers'

import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )

  return makeErrorLogDecorator(addSurveyController)
}
