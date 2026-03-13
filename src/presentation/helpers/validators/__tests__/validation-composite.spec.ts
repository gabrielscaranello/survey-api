import type { Validation } from '@/presentation/protocols'

import { ValidationComposite } from '@/presentation/helpers/validators'

const makeFakeInput = (): Record<string, string> => ({
  any_prop: 'any_value',
  other_prop: 'other_value'
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('ValidationComposite', () => {
  it('should call validates with correct values', () => {
    const input = makeFakeInput()
    const { sut, validationStubs } = makeSut()
    const validate1Spy = vi.spyOn(validationStubs[0], 'validate')
    const validate2Spy = vi.spyOn(validationStubs[1], 'validate')

    sut.validate(input)

    expect(validate1Spy).toHaveBeenCalledWith(input)
    expect(validate2Spy).toHaveBeenCalledWith(input)
  })

  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const error = new Error()
    vi.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(error)

    const result = sut.validate(makeFakeInput())

    expect(result).toBe(error)
  })

  it('should stop validations if one fails', () => {
    const { sut, validationStubs } = makeSut()
    const firstError = new Error('first_error')
    const secondError = new Error('second_error')
    const validate1Spy = vi
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(firstError)
    const validate2Spy = vi
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(secondError)

    const result = sut.validate(makeFakeInput())

    expect(validate1Spy).toHaveBeenCalled()
    expect(validate2Spy).not.toHaveBeenCalled()
    expect(result).toBe(firstError)
  })

  it('should return null if all validations pass', () => {
    const { sut } = makeSut()

    const result = sut.validate(makeFakeInput())

    expect(result).toBeNull()
  })
})
