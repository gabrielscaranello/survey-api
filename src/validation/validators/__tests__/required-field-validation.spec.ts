import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from '@/validation/validators'

const makeFakeInput = (): Record<string, string> => ({
  any_field: 'any_value',
  other_field: 'other_value'
})

interface SutTypes {
  sut: RequiredFieldValidation
  fieldName: string
}

const makeSut = (): SutTypes => {
  const fieldName = 'any_field'
  const sut = new RequiredFieldValidation(fieldName)

  return { sut, fieldName }
}

describe('RequiredFieldValidation', () => {
  it('should return a MissingParamError if field is missing', () => {
    const { sut, fieldName } = makeSut()

    const error = sut.validate({ other_field: 'any_value' })

    expect(error).toEqual(new MissingParamError(fieldName))
  })

  it('should return a MissingParamError if field is null', () => {
    const { sut, fieldName } = makeSut()
    const error = sut.validate({ [fieldName]: null })

    expect(error).toEqual(new MissingParamError(fieldName))
  })

  it('should return a MissingParamError if field is empty', () => {
    const { sut, fieldName } = makeSut()
    const error = sut.validate({ [fieldName]: '' })

    expect(error).toEqual(new MissingParamError(fieldName))
  })

  it('should return a MissingParamError if field is undefined', () => {
    const { sut, fieldName } = makeSut()
    const error = sut.validate({ [fieldName]: undefined })

    expect(error).toEqual(new MissingParamError(fieldName))
  })

  it('should return null validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate(makeFakeInput())

    expect(error).toBeNull()
  })
})
