import { MissingParamError } from '../errors'
import type { HttpRequest, HttpResponse } from '../protocols'

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body?.name) {
      return { statusCode: 400, body: new MissingParamError('name') }
    }

    if (!httpRequest.body.email) {
      return { statusCode: 400, body: new MissingParamError('email') }
    }
  }
}
