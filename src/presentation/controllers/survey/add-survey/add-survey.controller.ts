import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'

import { badRequest } from '@/presentation/helpers/http'

export class AddSurveyController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return await Promise.resolve(badRequest(error))
    }

    return await Promise.resolve(
      badRequest(new Error('Not complete implemented'))
    )
  }
}
