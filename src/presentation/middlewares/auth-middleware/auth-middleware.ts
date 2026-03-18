import type { LoadAccountByToken } from '@/domain/usecases'
import type { HttpRequest, Middleware } from '@/presentation/protocols'
import type { AuthMiddlewareResult } from './auth-middleware.types'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers/http'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string[]
  ) {}

  async handle(httpRequest: HttpRequest): Promise<AuthMiddlewareResult> {
    const error = forbidden(new AccessDeniedError())
    const authorization = httpRequest.headers?.Authorization

    if (!authorization) {
      return error
    }

    const account = await this.loadAccountByToken.load(authorization, this.role)
    if (!account) {
      return error
    }

    return ok({ accountId: account.id })
  }
}
