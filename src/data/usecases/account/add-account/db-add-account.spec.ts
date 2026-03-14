import type {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccountModel } from '@/domain/usecases'

import { EmailInUseError } from '@/domain/errors'

import { DbAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(_value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  return new HasherStub()
}

const makeAddAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(_data: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(_email: string): Promise<AccountModel | null> {
      return await Promise.resolve(null)
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  it('should call Hasher with correct password', async () => {
    const addAccountData = makeAddAccountData()
    const { sut, hasherStub } = makeSut()
    const hasherSpy = vi.spyOn(hasherStub, 'hash')

    await sut.add(addAccountData)

    expect(hasherSpy).toBeCalledWith(addAccountData.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    vi.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should call AddAccountRepository with correct values', async () => {
    const addAccountData = makeAddAccountData()
    const { password } = makeFakeAccount()
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(addAccountData)

    expect(addSpy).toBeCalledWith({ ...addAccountData, password })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    vi.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(makeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(makeAddAccountData())

    expect(loadSpy).toBeCalledWith('any_email@mail.com')
  })

  it('should throw if an account is already registered with the given email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    loadSpy.mockResolvedValueOnce(makeFakeAccount())

    const promise = sut.add(makeAddAccountData())

    await expect(promise).rejects.toThrow(new EmailInUseError())
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = vi.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    loadSpy.mockRejectedValueOnce(new Error())

    const promise = sut.add(makeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeAddAccountData())

    expect(account).toEqual(makeFakeAccount())
  })
})
