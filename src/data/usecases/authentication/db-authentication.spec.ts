import type { LoadAccountByEmailRepository } from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AuthenticationParams } from '@/domain/usecases'

import { DbAuthentication } from './db-authentication'

const makeFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(_: string): Promise<AccountModel | null> {
      return await Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return { sut, loadAccountByEmailRepositoryStub }
}

describe('DbAuthentication', () => {
  it('should call loadAccountByEmailRepository with correct email', async () => {
    const data = makeFakeAuthentication()
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(data)

    expect(loadSpy).toHaveBeenCalledWith(data.email)
  })
})
