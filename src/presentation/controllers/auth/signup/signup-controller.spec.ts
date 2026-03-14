import type { AccountModel } from '@/domain/models'
import type {
  AddAccount,
  AddAccountModel,
  Authentication,
  AuthenticationParams
} from '@/domain/usecases'
import type { HttpRequest, Validation } from '@/presentation/protocols'
import type { SignUpRequest } from './signup-controller-request'

import { EmailInUseError } from '@/domain/errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http'

import { SignupController } from './signup.controller'

const makeError = (): Error => {
  const error = new Error()
  error.stack = 'any_stack'
  return error
}

const makeFakeRequest = (): HttpRequest<SignUpRequest> => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(_: AuthenticationParams): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new AuthenticationStub()
}

interface SutTypes {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()

  const sut = new SignupController(
    addAccountStub,
    validationStub,
    authenticationStub
  )

  return { sut, addAccountStub, validationStub, authenticationStub }
}

describe('SignUp Controller', () => {
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

  it('should call AddAccont with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = vi.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    const { name, email, password } = httpRequest.body

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({ name, email, password })
  })

  it('should return 403 if email is already used', async () => {
    const { sut, addAccountStub } = makeSut()
    vi.spyOn(addAccountStub, 'add').mockRejectedValueOnce(makeError())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(makeError()))
  })

  it('should return 500 if addAccount throws', async () => {
    const error = new EmailInUseError()
    const { sut, addAccountStub } = makeSut()
    vi.spyOn(addAccountStub, 'add').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(error))
  })

  it('should call Authentication with correct values', async () => {
    const request = makeFakeRequest()
    const { email, password } = request.body
    const { sut, authenticationStub } = makeSut()
    const authSpy = vi.spyOn(authenticationStub, 'auth')

    await sut.handle(request)

    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    vi.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    const result = await sut.handle(makeFakeRequest())

    expect(result).toEqual(serverError(new Error()))
  })

  it('should return 200 if account is created', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
