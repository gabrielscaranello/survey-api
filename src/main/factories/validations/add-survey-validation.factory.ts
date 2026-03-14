import type { AddSurveyRequest } from '@/presentation/controllers'
import type { Validation } from '@/presentation/protocols'

import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields: Array<keyof AddSurveyRequest> = ['question', 'answers']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
