import request from 'supertest'

import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { app } from '@/main/config/app'
import type { SignUpRequest } from '@/presentation/controllers'
import { HTTPStatusCode } from '@/presentation/protocols'

const makeFakeRequestParams = (): SignUpRequest => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('Auth Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /api/auth/signup', () => {
    it('should return 200 on success', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(makeFakeRequestParams())
        .expect(HTTPStatusCode.OK)
    })
  })
})
