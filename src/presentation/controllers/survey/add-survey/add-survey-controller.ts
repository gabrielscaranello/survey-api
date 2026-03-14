import type { AddSurvey } from '@/domain/usecases'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'
import type { AddSurveyRequest } from './add-survey.types'

import { badRequest, noContent, serverError } from '@/presentation/helpers/http'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(
    httpRequest: HttpRequest<AddSurveyRequest>
  ): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return await Promise.resolve(badRequest(error))
      }

      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
