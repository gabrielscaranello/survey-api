import type { AddSurveyParams } from '@/domain/usecases'
import type { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers'

import { SurveyMongoRepository } from './survey-mongo-repository'

const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { answer: 'other_answer' }
  ]
})

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

describe('Survey Mongo Repository', () => {
  let surveysCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveysCollection = MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
  })

  it('should add a survey on success', async () => {
    const params = mockAddSurveyParams()
    const sut = makeSut()

    await sut.add(params)
    const survey = await surveysCollection.findOne({
      question: params.question
    })

    expect(survey).toBeTruthy()
  })
})
