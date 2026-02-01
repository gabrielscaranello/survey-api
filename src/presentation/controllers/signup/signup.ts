import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers'

import {
  HTTPStatusCode,
  type AddAccount,
  type Controller,
  type EmailValidator,
  type HttpRequest,
  type HttpResponse
} from './signup.protocols.ts'

export class SignupController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = this.addAccount.add({ name, email, password })

      return { body: account, statusCode: HTTPStatusCode.CREATED }
    } catch {
      return serverError()
    }
  }
}
