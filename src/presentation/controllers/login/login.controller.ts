import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import type {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'

import type { LoginRequest } from './login-controller-request'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }
    return await Promise.resolve(badRequest(new MissingParamError('password')))
  }
}
