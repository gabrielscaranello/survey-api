import type { Hasher } from '@/data/protocols'

import { DbAddAccount } from './db-add-account'

interface SutTypes {
  hasherStub: Hasher
  sut: DbAddAccount
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(_value: string): Promise<string> {
      return await Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const sut = new DbAddAccount(hasherStub)

  return { sut, hasherStub }
}

describe('DbAddAccount UseCase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = vi.spyOn(hasherStub, 'hash')

    await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(hasherSpy).toBeCalledWith('any_password')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    vi.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())

    const promise = sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    await expect(promise).rejects.toThrow()
  })
})
