import { InvalidParamError } from '@/presentation/errors'
import type { Validation } from '@/presentation/helpers/validators'
import type { EmailValidator } from '@/presentation/protocols/email-validator'

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate(input: any): Error | null {
    const isValid = this.emailValidator.isValid(String(input[this.fieldName]))

    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }

    return null
  }
}
