import type { SignUpRequest } from '@/presentation/controllers'
import type { Validation } from '@/presentation/protocols'

import {
  CompareFieldValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/presentation/helpers/validators'
import { EmailValidatorAdapter } from '@/utils'

export const makeSignupValidation = (): Validation => {
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

  return new ValidationComposite(validations)
}
