import type { AddSurveyRequest } from '@/presentation/controllers'
import type { Validation } from '@/presentation/protocols'

import { makeAddSurveyValidation } from '@/main/factories'
import {
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

vi.mock('@/validation/validators', async () => ({
  ...(await vi.importActual('@/validation/validators')),
  ValidationComposite: vi.fn()
}))

describe('AddSurvey Validation Factory', () => {
  it('should make ValidationComposite with all validations', () => {
    const validations: Validation[] = []
    const requiredFields: Array<keyof AddSurveyRequest> = [
      'question',
      'answers'
    ]

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    makeAddSurveyValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
