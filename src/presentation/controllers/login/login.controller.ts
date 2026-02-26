import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers'

import type {
  Authentication,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  LoginRequest
} from './login-controller.protocols'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    try {
      const requiredFields: Array<keyof LoginRequest> = ['email', 'password']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
