import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'

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
      const { email, password } = httpRequest.body

      if (!email) {
        return badRequest(new MissingParamError('email'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      if (!password) {
        return badRequest(new MissingParamError('password'))
      }

      await this.authentication.auth({ email, password })

      return ok({})
    } catch (error) {
      return serverError(error)
    }
  }
}
