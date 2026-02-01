import type { EmailValidator } from '@/presentation/protocols/email-validator'

import { EmailValidatorAdapter } from './email-validator.adapter'

const makeSut = (): EmailValidator => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return emailValidatorAdapter
}

describe('Email Validator Adapter', () => {
  it('should return false if validator return false', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_email.com')

    expect(isValid).toBe(false)
  })
})
