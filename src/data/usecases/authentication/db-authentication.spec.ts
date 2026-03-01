import type {
  HashComparer,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AuthenticationParams } from '@/domain/usecases'

import { DbAuthentication } from './db-authentication'

const makeFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_mail@mail.com',
  password: 'any_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_mail@mail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(_: string): Promise<AccountModel | null> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_: string, __: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  )

  return { sut, loadAccountByEmailRepositoryStub, hashComparerStub }
}

describe('DbAuthentication', () => {
  it('should call loadAccountByEmailRepository with correct email', async () => {
    const data = makeFakeAuthentication()
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth(data)

    expect(loadSpy).toHaveBeenCalledWith(data.email)
  })

  it('should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut } = makeSut()

    const account = await sut.auth(makeFakeAuthentication())

    expect(account).toBeNull()
  })

  it('should call hashComparer with correct values', async () => {
    const data = makeFakeAuthentication()
    const account = makeFakeAccount()
    const { sut, hashComparerStub } = makeSut()
    const hashSpy = vi.spyOn(hashComparerStub, 'compare')

    await sut.auth(data)

    expect(hashSpy).toHaveBeenCalledWith(data.password, account.password)
  })
})
