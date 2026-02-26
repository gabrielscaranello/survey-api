import { InvalidParamError } from '@/presentation/errors'

import { CompareFieldValidation } from './compare-field.validation'

const makeFakeInput = (): Record<string, string> => ({
  any_field: 'any_value',
  field_to_compare: 'any_value'
})

interface SutTypes {
  sut: CompareFieldValidation
  fieldName: string
  fieldToCompareName: string
}

const makeSut = (): SutTypes => {
  const fieldName = 'any_field'
  const fieldToCompareName = 'field_to_compare'
  const sut = new CompareFieldValidation(fieldName, fieldToCompareName)

  return { sut, fieldName, fieldToCompareName }
}

describe('RequiredFieldValidation', () => {
  it('should return a InvalidParamError if field is missing', () => {
    const { sut, fieldName, fieldToCompareName } = makeSut()
    const input = makeFakeInput()
    input[fieldToCompareName] = 'other_value'

    const error = sut.validate(input)

    expect(error).toEqual(new InvalidParamError(fieldName))
  })

  it('should return null validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate(makeFakeInput())

    expect(error).toBeNull()
  })
})
