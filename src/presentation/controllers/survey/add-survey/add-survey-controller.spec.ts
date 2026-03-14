import type { AddSurvey, AddSurveyParams } from '@/domain/usecases'
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

const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(_: AddSurveyParams): Promise<void> {
      await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}
const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return { sut, validationStub, addSurveyStub }
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

  it('should call AddSurvey with correct values', async () => {
    const httpRequest = mockRequest()
    const { sut, addSurveyStub } = makeSut()
    const addSurveySpy = vi.spyOn(addSurveyStub, 'add')

    await sut.handle(httpRequest)

    expect(addSurveySpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
