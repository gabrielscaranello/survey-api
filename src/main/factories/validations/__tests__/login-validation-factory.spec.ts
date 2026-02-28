import { makeLoginValidation } from '@/main/factories'
import type { LoginRequest } from '@/presentation/controllers'
import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
  type Validation
} from '@/presentation/helpers/validators'
import { EmailValidatorAdapter } from '@/utils'

vi.mock('@/presentation/helpers/validators', async () => ({
  ...(await vi.importActual('@/presentation/helpers/validators')),
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
