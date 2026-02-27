import { badRequest, ok, serverError } from '@/presentation/helpers'

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
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest<SignUpRequest>): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
