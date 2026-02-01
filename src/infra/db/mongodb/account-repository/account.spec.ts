import { MongoHelper } from '@/infra/db/mongodb/helpers'

import { AccountMongoRepository } from './account'

const makeSut = (): AccountMongoRepository => {
  const sut = new AccountMongoRepository()
  return sut
}

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
    const sut = makeSut()

    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    })

    expect(account).toBeTruthy()
    expect(account).not.toHaveProperty('_id')
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email')
    expect(account.password).toBe('valid_password')
  })
})
