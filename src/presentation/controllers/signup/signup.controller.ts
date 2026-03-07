import type { Authentication } from '@/domain/usecases'
import { badRequest, ok, serverError } from '@/presentation/helpers/http'

import type {
  AddAccount,
  Controller,
  HttpRequest,
  HttpResponse,
  SignUpRequest,
  Validation
} from './signup-controller.protocols'

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
      return serverError(error)
    }
  }
}
