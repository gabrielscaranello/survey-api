import { InvalidParamError } from '@/presentation/errors'
import type { EmailValidator } from '@/presentation/protocols/email-validator'

import { EmailValidation } from './email.validation'

const makeFakeInput = (): Record<string, string> => ({
  email: 'any_email@mail.com'
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  fieldName: string
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const fieldName = 'email'
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(fieldName, emailValidatorStub)

  return { sut, fieldName, emailValidatorStub }
}

describe('EmailValidation', () => {
  it('should call EmailValidator with correct value', () => {
    const input = makeFakeInput()
    const { sut, emailValidatorStub, fieldName } = makeSut()
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid')

    sut.validate(input)

    expect(isValidSpy).toHaveBeenCalledWith(input[fieldName])
  })

  it('should EmailValidation throw with EmailValidator throws', () => {
    const input = makeFakeInput()
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const handle = (): Error | null => sut.validate(input)

    expect(handle).toThrow()
  })

  it('should return a InvalidParamError if field is missing', () => {
    const { sut, fieldName, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate(makeFakeInput())

    expect(error).toEqual(new InvalidParamError(fieldName))
  })

  it('should return null validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate(makeFakeInput())

    expect(error).toBeNull()
  })
})
