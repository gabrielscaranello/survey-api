import {
  ValidationComposite,
  type Validation
} from '@/presentation/helpers/validators'

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
  validations: Validation[]
}

const makeSut = (): SutTypes => {
  const validations = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validations)

  return { sut, validations }
}

describe('ValidationComposite', () => {
  it('should call validates with correct values', () => {
    const input = makeFakeInput()
    const { sut, validations } = makeSut()
    const validate1Spy = vi.spyOn(validations[0], 'validate')
    const validate2Spy = vi.spyOn(validations[1], 'validate')

    sut.validate(input)

    expect(validate1Spy).toHaveBeenCalledWith(input)
    expect(validate2Spy).toHaveBeenCalledWith(input)
  })

  it('should return an error if any validation fails', () => {
    const { sut, validations } = makeSut()
    const error = new Error()
    vi.spyOn(validations[0], 'validate').mockReturnValueOnce(error)

    const result = sut.validate(makeFakeInput())

    expect(result).toBe(error)
  })

  it('should stop validations if one fails', () => {
    const { sut, validations } = makeSut()
    const validate1Spy = vi
      .spyOn(validations[0], 'validate')
      .mockReturnValueOnce(new Error())
    const validate2Spy = vi.spyOn(validations[1], 'validate')

    sut.validate(makeFakeInput())

    expect(validate1Spy).toHaveBeenCalled()
    expect(validate2Spy).not.toHaveBeenCalled()
  })

  it('should return null if all validations pass', () => {
    const { sut } = makeSut()

    const result = sut.validate(makeFakeInput())

    expect(result).toBeNull()
  })
})
