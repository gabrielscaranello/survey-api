import type { SignUpRequest } from '@/presentation/controllers'
import {
  CompareFieldValidation,
  RequiredFieldValidation,
  ValidationComposite,
  type Validation
} from '@/presentation/helpers/validators'

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
    new CompareFieldValidation('passwordConfirmation', 'password')
  )

  return new ValidationComposite(validations)
}
