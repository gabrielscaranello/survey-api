import type { HttpRequest, Validation } from '@/presentation/protocols'
import type { BodyValidationResult } from './body-validation.types'

import { InvalidRequestError } from '@/presentation/errors'

export const bodyValidation = <T>(
  request: HttpRequest<T>,
  _validation: Validation
): BodyValidationResult<T> => {
  if (!request.body) {
    return {
      error: new InvalidRequestError('no request body provided'),
      body: null
    }
  }

  return { error: null, body: request.body }
}
