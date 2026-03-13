import type { LoginRequest } from '@/presentation/controllers'
import type { Validation } from '@/presentation/protocols'

import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/presentation/helpers/validators'
import { EmailValidatorAdapter } from '@/utils'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []
  const requiredFields: Array<keyof LoginRequest> = ['email', 'password']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
