import { InvalidParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'

import type {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  SignUpRequest,
  Validation
} from './signup-controller.protocols'
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

interface SutTypes {
  sut: SignupController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()

  const sut = new SignupController(addAccountStub, validationStub)

  return { sut, addAccountStub, validationStub }
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
    const error = new InvalidParamError('any_field')
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

  it('should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    vi.spyOn(addAccountStub, 'add').mockRejectedValueOnce(makeError())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(makeError()))
  })

  it('should return 200 if account is created', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
