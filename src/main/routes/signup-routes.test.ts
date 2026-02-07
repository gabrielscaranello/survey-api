import request from 'supertest'

import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { app } from '@/main/config/app'
import { HTTPStatusCode } from '@/presentation/protocols'

describe('Signup Routes', () => {
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

  const uri = '/api/signup'

  it('should return an account on success', async () => {
    await request(app)
      .post(uri)
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(HTTPStatusCode.OK)
  })
})
