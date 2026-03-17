import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'

import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return { sut }
}

describe('Auth Middleware', () => {
  it('should return 403 if no Authorization header is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
