import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import type { HttpRequest } from '@/presentation/protocols'

import type { LoginRequest } from './login-controller-request'
import { LoginController } from './login.controller'

const makeFakeRequest = (): HttpRequest<LoginRequest> => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  it('should return 400 if no email is provided', async () => {
    const request = makeFakeRequest()
    request.body.email = ''
    const { sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const request = makeFakeRequest()
    request.body.password = ''
    const { sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toEqual(badRequest(new MissingParamError('password')))
  })
})
