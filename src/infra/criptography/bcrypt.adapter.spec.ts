import { BcryptAdapter } from './bcrypt.adapter'

const mockedHash = vi.fn()

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
})
