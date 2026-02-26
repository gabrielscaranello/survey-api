import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers'

import type {
  EmailValidator,
  HttpRequest,
  LoginRequest
} from './login-controller.protocols'
import { LoginController } from './login.controller'

const makeFakeRequest = (): HttpRequest<LoginRequest> => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const request = makeFakeRequest()
    request.body.email = ''
    const { sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if invalid email is provided', async () => {
    const request = makeFakeRequest()
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = await sut.handle(request)

    expect(result).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const request = makeFakeRequest()
    request.body.password = ''
    const { sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should call email validator with correct email', async () => {
    const request = makeFakeRequest()
    const { sut, emailValidatorStub } = makeSut()
    const isValidEmailSpy = vi.spyOn(emailValidatorStub, 'isValid')

    await sut.handle(request)

    expect(isValidEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return 500 if emailValidator throws', async () => {
    const request = makeFakeRequest()
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.handle(request)

    expect(result).toEqual(serverError(new Error()))
  })
})
