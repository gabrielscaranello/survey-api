import { JWTAdapter } from './jwt.adapter'

const mockedSign = vi.fn()
vi.mock('jsonwebtoken', () => ({
  sign: (...args: []): any => mockedSign(...args)
}))

describe('JWT Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JWTAdapter('secret')
    await sut.encrypt('any_id')

    expect(mockedSign).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
