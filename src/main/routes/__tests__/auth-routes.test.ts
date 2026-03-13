import request from 'supertest'

import type { SignUpRequest } from '@/presentation/controllers'
import type { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { app } from '@/main/config/app'
import { makeBcryptAdapter } from '@/main/factories'
import { HTTPStatusCode } from '@/presentation/protocols'

const makeFakeSignupRequestParams = (): SignUpRequest => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password'
})

describe('Auth Routes', () => {
  const bcryptAdapter = makeBcryptAdapter()
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(globalThis.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /api/auth/signup', () => {
    it('should return 200 on success', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(makeFakeSignupRequestParams())
        .expect(HTTPStatusCode.OK)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should return 200 on success', async () => {
      const email = 'any_email@mail.com'
      const password = 'any_password'
      const hashPassword = await bcryptAdapter.hash(password)
      await accountCollection.insertOne({
        name: 'any_name',
        email,
        password: hashPassword
      })

      const result = await request(app)
        .post('/api/auth/login')
        .send({ email, password })

      expect(result.status).toBe(HTTPStatusCode.OK)
      expect(result.body).toHaveProperty('accessToken')
    })
  })
})
