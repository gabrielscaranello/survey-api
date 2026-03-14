import type { AddAccount, Authentication } from '@/domain/usecases'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'
import type { SignUpRequest } from './signup-controller-request'

import { EmailInUseError } from '@/domain/errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers/http'

export class SignupController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest<SignUpRequest>): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body
      await this.addAccount.add({ name, email, password })
      const accessToken = await this.authentication.auth({ email, password })

      return ok({ accessToken })
    } catch (error) {
      if (error instanceof EmailInUseError) {
        return forbidden(error)
      }
      return serverError(error)
    }
  }
}
