import type { LoadAccountByToken } from '@/domain/usecases'
import type {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@/presentation/protocols'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string[]
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const authorization = httpRequest.headers?.Authorization

    if (authorization) {
      await this.loadAccountByToken.load(authorization, this.role)
    }

    return forbidden(new AccessDeniedError())
  }
}
