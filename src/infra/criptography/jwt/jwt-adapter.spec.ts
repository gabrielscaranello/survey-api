import { JWTAdapter } from './jwt.adapter'

const mockedSign = vi.fn().mockReturnValue('any_token')
vi.mock('jsonwebtoken', () => ({
  sign: (...args: []): any => mockedSign(...args)
}))

describe('JWT Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JWTAdapter('secret')
    await sut.encrypt('any_id')

    expect(mockedSign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })

  it('should return a token on sign success', async () => {
    const sut = new JWTAdapter('secret')

    const accessToken = await sut.encrypt('any_id')

    expect(accessToken).toBe('any_token')
  })
})
