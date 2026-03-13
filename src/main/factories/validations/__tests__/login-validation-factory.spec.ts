import type { LoginRequest } from '@/presentation/controllers'
import type { Validation } from '@/presentation/protocols'

import { EmailValidatorAdapter } from '@/infra/validators'
import { makeLoginValidation } from '@/main/factories'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '@/validation/validators'

vi.mock('@/validation/validators', async () => ({
  ...(await vi.importActual('@/validation/validators')),
  ValidationComposite: vi.fn()
}))

describe('Login Validation Factory', () => {
  it('should make ValidationComposite with all validations', () => {
    const validations: Validation[] = []
    const requiredFields: Array<keyof LoginRequest> = ['email', 'password']

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    makeLoginValidation()

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
