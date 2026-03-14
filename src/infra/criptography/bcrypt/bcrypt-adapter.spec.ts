import { BcryptAdapter } from './bcrypt-adapter'

const mockedHash = vi.fn().mockReturnValue('hashed_value')
const mockedCompare = vi.fn().mockReturnValue(true)

vi.mock('bcrypt', () => ({
  hash: (...args: []): any => mockedHash(...args),
  compare: (...args: []): any => mockedCompare(...args)
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
  describe('hash', () => {
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

  describe('compare', () => {
    it('should call bcrypt.compare with correct values', async () => {
      const { sut } = makeSut()

      await sut.compare('any_value', 'any_hash')

      expect(mockedCompare).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('should return false if bcrypt.compare returns false', async () => {
      mockedCompare.mockReturnValueOnce(false)
      const { sut } = makeSut()

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(false)
    })

    it('should return true if bcrypt.compare returns true', async () => {
      mockedCompare.mockReturnValueOnce(true)
      const { sut } = makeSut()

      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(true)
    })

    it('should throw if bcrypt.compare throws', async () => {
      mockedCompare.mockRejectedValueOnce(new Error())
      const { sut } = makeSut()

      const promise = sut.compare('any_value', 'any_hash')

      await expect(promise).rejects.toThrow()
    })
  })
})
