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

  const error = validation.validate(request.body)
  if (error) {
    return { error, body: null }
  }

  return { error: null, body: request.body }
}
