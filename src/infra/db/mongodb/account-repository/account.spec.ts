import type { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

import { AccountMongoRepository } from './account'

const makeAddAccountData = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

describe('Account Mongo Repository', () => {
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

  it('should return an account on success', async () => {
    const data = makeAddAccountData()
    const sut = makeSut()

    const account = await sut.add(data)

    expect(account).toBeTruthy()
    expect(account).not.toHaveProperty('_id')
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(data.name)
    expect(account.email).toBe(data.email)
    expect(account.password).toBe(data.password)
  })
})
