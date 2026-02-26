import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import type {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'

import type { LoginRequest } from './login-controller-request'

export class LoginController implements Controller {
  async handle(_: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    return await Promise.resolve(badRequest(new MissingParamError('email')))
  }
}
