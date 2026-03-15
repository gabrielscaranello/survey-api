import type { HttpRequest, Validation } from '@/presentation/protocols'
import type { BodyValidationResult } from './body-validation.types'

import { InvalidRequestError } from '@/presentation/errors'

export const bodyValidation = <T>(
  _request: HttpRequest,
  _validation: Validation
): BodyValidationResult<T> => ({
  body: null,
  error: new InvalidRequestError('no request body provided')
})
