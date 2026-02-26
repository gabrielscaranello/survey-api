import { InvalidParamError } from '@/presentation/errors'
import { badRequest, ok, serverError } from '@/presentation/helpers'

import type {
  AddAccount,
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  SignUpRequest,
  Validation
} from './signup-controller.protocols'

export class SignupController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation?: Validation
  ) {}

  async handle(httpRequest: HttpRequest<SignUpRequest>): Promise<HttpResponse> {
    try {
      const validationError = this.validation?.validate(httpRequest.body)
      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
