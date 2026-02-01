import type { EmailValidator } from '@/presentation/protocols/email-validator'

import { EmailValidatorAdapter } from './email-validator.adapter'

const mockedIsEmail = vi.fn().mockReturnValue(true)

const makeSut = (): EmailValidator => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return emailValidatorAdapter
}

vi.mock('validator/lib/isEmail', () => ({
  default: (...args: []): any => mockedIsEmail(...args)
}))

describe('Email Validator Adapter', () => {
  it('should return false if validator return false', () => {
    mockedIsEmail.mockReturnValueOnce(false)
    const sut = makeSut()

    const isValid = sut.isValid('invalid@email.com')

    expect(isValid).toBe(false)
  })

  it('should return true if validator return true', () => {
    const sut = makeSut()

    const isValid = sut.isValid('valid@email.com')

    expect(isValid).toBe(true)
  })
})
