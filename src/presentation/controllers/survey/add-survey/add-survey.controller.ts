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
    this.validation.validate(httpRequest.body)

    return await Promise.resolve(
      badRequest(new Error('Not complete implemented'))
    )
  }
}
