import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'

import type {
  AccountModel,
  AddAccount,
  AddAccountModel,
  EmailValidator,
  HttpRequest,
  SignUpRequest
} from './signup-controller.protocols'
import { SignupController } from './signup.controller'

interface SutTypes {
  sut: SignupController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

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

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignupController(emailValidatorStub, addAccountStub)

  return { sut, emailValidatorStub, addAccountStub }
}

describe('SignUp Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.name = ''

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.email = ''

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.password = ''

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.passwordConfirmation = ''

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation'))
    )
  })

  it('should return 400 if passwordConfirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.passwordConfirmation = 'wrong_confirmation'

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation'))
    )
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw makeError()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(makeError()))
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
