import request from 'supertest'

import type { AddSurveyRequest } from '@/presentation/controllers'
import type { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { app } from '@/main/config/app'
import { HTTPStatusCode } from '@/presentation/protocols'

const mockAddSurveyRequestParams = (): AddSurveyRequest => ({
  question: 'any_question',
  answers: [
    { image: 'any_image', answer: 'any_answer' },
    { answer: 'other_answer' }
  ]
})

describe('Survey Routes', () => {
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

  describe('POST /api/surveys', () => {
    it('should return 204 on success', async () => {
      await request(app)
        .post('/api/surveys')
        .send(mockAddSurveyRequestParams())
        .expect(HTTPStatusCode.NO_CONTENT)
    })
  })
})
