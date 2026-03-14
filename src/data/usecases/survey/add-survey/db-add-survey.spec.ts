import type { AddSurveyRepository } from '@/data/protocols'
import type { AddSurveyParams } from '@/domain/usecases'

import { DbAddSurvey } from './db-add-survey'

const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { answer: 'other_answer' }
  ]
})

const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey UseCase', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const params = mockAddSurveyParams()
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = vi.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add(params)

    expect(addSpy).toHaveBeenCalledWith(params)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    vi.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddSurveyParams())

    await expect(promise).rejects.toThrow()
  })
})
