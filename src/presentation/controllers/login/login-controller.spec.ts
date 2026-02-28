import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers/http'

import type {
  Authentication,
  AuthenticationParams,
  HttpRequest,
  LoginRequest,
  Validation
} from './login-controller.protocols'
import { LoginController } from './login.controller'

const makeFakeRequest = (): HttpRequest<LoginRequest> => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

const makeFakeToken = (): string => 'any_token'

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(_: AuthenticationParams): Promise<string> {
      return await Promise.resolve(makeFakeToken())
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)

  return { sut, validationStub, authenticationStub }
}

describe('Login Controller', () => {
  it('should call Validation with correct values', async () => {
    const request = makeFakeRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const error = new Error('any_error')
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(error)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(error))
  })

  it('should call Authentication with correct values', async () => {
    const request = makeFakeRequest()
    const { sut, authenticationStub } = makeSut()
    const authSpy = vi.spyOn(authenticationStub, 'auth')

    await sut.handle(request)

    expect(authSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return 401 if Authentication returns null', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(serverError(new Error()))
  })

  it('should return 200 if Authentication succeeds', async () => {
    const { sut } = makeSut()

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(ok({ accessToken: makeFakeToken() }))
  })
})
