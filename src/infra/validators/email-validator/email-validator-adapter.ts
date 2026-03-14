import isEmail from 'validator/lib/isEmail'

import type { EmailValidator } from '@/validation/protocols'

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return isEmail(email)
  }
}
