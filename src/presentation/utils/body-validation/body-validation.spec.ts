import type { Validation } from '@/presentation/protocols'

import { InvalidRequestError } from '@/presentation/errors'

import { bodyValidation as sut } from './body-validation'

class ValidationStub implements Validation {
  validate(): Error | null {
    return null
  }
}

const validationStub = new ValidationStub()

describe('Body Validation', () => {
  it('should return an error if no body is provided', () => {
    const { error, body } = sut({ body: undefined }, validationStub)

    expect(error).toEqual(new InvalidRequestError('no request body provided'))
    expect(body).toBe(null)
  })
})
