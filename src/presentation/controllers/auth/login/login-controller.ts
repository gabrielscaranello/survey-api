import type { Authentication } from '@/domain/usecases'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'
import type { LoginRequest } from './login-controller.types'

import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers/http'
import { bodyValidation } from '@/presentation/utils'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    try {
      const { error, body } = bodyValidation(httpRequest, this.validation)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = body
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
