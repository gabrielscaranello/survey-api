import type { Controller } from '@/presentation/protocols'

import {
  makeAddSurveyValidation,
  makeDbAddSurvey,
  makeErrorLogDecorator
} from '@/main/factories'
import { AddSurveyController } from '@/presentation/controllers'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  )

  return makeErrorLogDecorator(addSurveyController)
}
