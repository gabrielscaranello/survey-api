import type { HttpRequest, Validation } from '@/presentation/protocols'

import { InvalidRequestError } from '@/presentation/errors'

import { bodyValidation as sut } from './body-validation'

class ValidationStub implements Validation {
  validate(): Error | null {
    return null
  }
}

const validationStub = new ValidationStub()

const mockRequest = (): HttpRequest<Record<string, string>> => ({
  body: { any_field: 'any_value' }
})

describe('Body Validation', () => {
  it('should return an error if no body is provided', () => {
    const { error, body } = sut({ body: undefined }, validationStub)

    expect(error).toEqual(new InvalidRequestError('no request body provided'))
    expect(body).toBe(null)
  })

  it('should return body if all validations pass', () => {
    const { error, body } = sut(mockRequest(), validationStub)

    expect(error).toBe(null)
    expect(body).toEqual(mockRequest().body)
  })
})
