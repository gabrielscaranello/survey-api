import type { SignUpRequest } from '@/presentation/controllers'
import {
  CompareFieldValidation,
  RequiredFieldValidation,
  ValidationComposite,
  type Validation
} from '@/presentation/helpers/validators'

import { makeSignupValidation } from './signup-validation.factory'

vi.mock('@/presentation/helpers/validators', async () => ({
  ...(await vi.importActual('@/presentation/helpers/validators')),
  ValidationComposite: vi.fn()
}))

describe('Signup Validation Factory', () => {
  it('Should make ValidationComposite with all validations', () => {
    const validations: Validation[] = []
    const requiredFields: Array<keyof SignUpRequest> = [
      'name',
      'email',
      'password',
      'passwordConfirmation'
    ]

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new CompareFieldValidation('passwordConfirmation', 'password')
    )

    makeSignupValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
