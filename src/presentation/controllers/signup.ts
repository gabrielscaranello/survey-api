import { MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'
import type { HttpRequest, HttpResponse } from '../protocols'

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body?.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
