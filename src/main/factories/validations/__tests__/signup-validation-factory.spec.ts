import type { SignUpRequest } from '@/presentation/controllers'
import type { Validation } from '@/presentation/protocols'

import { makeSignupValidation } from '@/main/factories'
import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/presentation/helpers/validators'
import { EmailValidatorAdapter } from '@/utils'

vi.mock('@/presentation/helpers/validators', async () => ({
  ...(await vi.importActual('@/presentation/helpers/validators')),
  ValidationComposite: vi.fn()
}))

describe('Signup Validation Factory', () => {
  it('should make ValidationComposite with all validations', () => {
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
      new CompareFieldValidation('passwordConfirmation', 'password'),
      new EmailValidation('email', new EmailValidatorAdapter())
    )

    makeSignupValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
