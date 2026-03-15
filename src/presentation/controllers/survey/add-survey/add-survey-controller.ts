import type { AddSurvey } from '@/domain/usecases'
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '@/presentation/protocols'
import type { AddSurveyRequest } from './add-survey.types'

import { badRequest, noContent, serverError } from '@/presentation/helpers/http'
import { bodyValidation } from '@/presentation/utils'

export class AddSurveyController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle(
    httpRequest: HttpRequest<AddSurveyRequest>
  ): Promise<HttpResponse> {
    try {
      const { error, body } = bodyValidation(httpRequest, this.validation)
      if (error) {
        return badRequest(error)
      }

      const { question, answers } = body
      await this.addSurvey.add({ question, answers })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
