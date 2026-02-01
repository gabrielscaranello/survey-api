import { BcryptAdapter } from './bcrypt.adapter'

const mockedHash = vi.fn().mockReturnValue('hashed_value')

vi.mock('bcrypt', () => ({
  hash: (...args: []): any => mockedHash(...args)
}))

interface SutTypes {
  salt: number
  sut: BcryptAdapter
}

const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)

  return { salt, sut }
}

describe('Bcrypt Adapter', () => {
  it('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    await sut.hash('any_value')

    expect(mockedHash).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')

    expect(hash).toBe('hashed_value')
  })

  it('should throw if bcrypt throws', async () => {
    mockedHash.mockRejectedValueOnce(new Error())
    const { sut } = makeSut()

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow()
  })
})
