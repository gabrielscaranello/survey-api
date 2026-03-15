import type { HttpRequest, Validation } from '@/presentation/protocols'
import type { BodyValidationResult } from './body-validation.types'

import { InvalidRequestError } from '@/presentation/errors'

export const bodyValidation = <T>(
  request: HttpRequest<T>,
  validation: Validation
): BodyValidationResult<T> => {
  if (!request.body) {
    const error = new InvalidRequestError('no request body provided')
    return { error, body: null }
  }

  validation.validate(request.body)

  return { error: null, body: request.body }
}
