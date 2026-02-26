import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'

import type {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  LoginRequest
} from './login-controller.protocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await Promise.resolve(badRequest(new MissingParamError('email')))
    }

    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
    if (!isValidEmail) {
      return await Promise.resolve(badRequest(new InvalidParamError('email')))
    }

    return await Promise.resolve(badRequest(new MissingParamError('password')))
  }
}
