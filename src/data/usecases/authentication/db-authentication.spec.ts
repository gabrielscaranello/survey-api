import type {
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator,
  UpdateAccessTokenRepository
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
    async compare(_: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generateToken(_: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(_: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepository: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepository = makeUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepository
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepository
  }
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
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    ).mockResolvedValueOnce(null)

    const account = await sut.auth(makeFakeAuthentication())

    expect(account).toBeNull()
  })

  it('should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    vi.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    ).mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('should call hashComparer with correct values', async () => {
    const data = makeFakeAuthentication()
    const account = makeFakeAccount()
    const { sut, hashComparerStub } = makeSut()
    const hashSpy = vi.spyOn(hashComparerStub, 'compare')

    await sut.auth(data)

    expect(hashSpy).toHaveBeenCalledWith(data.password, account.password)
  })

  it('should return null if hashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

    const account = await sut.auth(makeFakeAuthentication())

    expect(account).toBeNull()
  })

  it('should throw if hashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('should call TokenGenerator with correct accountId', async () => {
    const account = makeFakeAccount()
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenSpy = vi.spyOn(tokenGeneratorStub, 'generateToken')

    await sut.auth(makeFakeAuthentication())

    expect(tokenSpy).toHaveBeenCalledWith(account.id)
  })

  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    vi.spyOn(tokenGeneratorStub, 'generateToken').mockRejectedValueOnce(
      new Error()
    )

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const account = makeFakeAccount()
    const { sut, updateAccessTokenRepository } = makeSut()
    const updateSpy = vi.spyOn(updateAccessTokenRepository, 'updateAccessToken')

    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith(account.id, 'any_token')
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut()
    vi.spyOn(
      updateAccessTokenRepository,
      'updateAccessToken'
    ).mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('should return an accessToken on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe('any_token')
  })
})
