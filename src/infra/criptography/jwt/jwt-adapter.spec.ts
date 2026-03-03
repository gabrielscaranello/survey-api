import { JWTAdapter } from './jwt.adapter'

const mockedSign = vi.fn().mockReturnValue('any_token')
vi.mock('jsonwebtoken', () => ({
  sign: (...args: []): any => mockedSign(...args)
}))

const makeSut = (): JWTAdapter => new JWTAdapter('secret')

describe('JWT Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut()
    await sut.encrypt('any_id')

    expect(mockedSign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  it('should return a token on sign success', async () => {
    const sut = makeSut()

    const accessToken = await sut.encrypt('any_id')

    expect(accessToken).toBe('any_token')
  })

  it('should throw if sign throws', async () => {
    const sut = makeSut()
    mockedSign.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.encrypt('any_id')

    await expect(promise).rejects.toThrow()
  })
})
