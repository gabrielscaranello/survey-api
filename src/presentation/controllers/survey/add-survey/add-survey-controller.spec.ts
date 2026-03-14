import type { HttpRequest, Validation } from '@/presentation/protocols'
import type { AddSurveyRequest } from './add-survey.protocols'

import { badRequest } from '@/presentation/helpers/http'

import { AddSurveyController } from './add-survey.controller'

const mockRequest = (): HttpRequest<AddSurveyRequest> => ({
  body: {
    question: 'any_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }]
  }
})

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const sut = new AddSurveyController(validationStub)

  return { sut, validationStub }
}

describe('AddSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    const httpRequest = mockRequest()
    const { sut, validationStub } = makeSut()
    const validateSpy = vi.spyOn(validationStub, 'validate')

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('any_error')
    const { sut, validationStub } = makeSut()
    vi.spyOn(validationStub, 'validate').mockReturnValueOnce(error)

    const httpResponse = await sut.handle(mockRequest())

    expect(httpResponse).toEqual(badRequest(error))
  })
})
