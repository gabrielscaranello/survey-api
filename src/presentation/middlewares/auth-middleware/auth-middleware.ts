import type {
  HttpRequest,
  HttpResponse,
  Middleware
} from '@/presentation/protocols'

import { AccessDeniedError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http'

export class AuthMiddleware implements Middleware {
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    return await Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
