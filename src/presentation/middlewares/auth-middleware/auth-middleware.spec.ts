import type { AccountModel } from '@/domain/models'
import type { LoadAccountByToken } from '@/domain/usecases'
import type { HttpRequest } from '@/presentation/protocols'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers/http'

import { AuthMiddleware } from './auth-middleware'

const mockRequest = (): HttpRequest => ({
  headers: { Authorization: 'any_token' }
})

const mockAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(): Promise<AccountModel> {
      return await Promise.resolve(mockAccount())
    }
  }

  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: AuthMiddleware
  roles?: string[]
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const roles = ['any_role']
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, roles)

  return { sut, roles, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
  it('should return 403 if no Authorization header is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call loadAccountByToken with correct values', async () => {
    const request = mockRequest()
    const { sut, loadAccountByTokenStub, roles } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(request)

    expect(loadSpy).toHaveBeenCalledWith(request.headers?.Authorization, roles)
  })

  it('should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    vi.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if loadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(ok({ accountId: 'any_id' }))
  })
})
