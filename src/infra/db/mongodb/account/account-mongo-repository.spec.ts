import type { AccountModel } from '@/domain/models'
import type { AddAccountParams } from '@/domain/usecases'
import type { Collection } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers'

import { AccountMongoRepository } from './account-mongo.repository'

const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

describe('Account Mongo Repository', () => {
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

  it('should return an account on save success', async () => {
    const params = mockAddAccountParams()
    const sut = makeSut()

    const account = await sut.add(params)

    expect(account).toBeTruthy()
    expect(account).not.toHaveProperty('_id')
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(params.name)
    expect(account.email).toBe(params.email)
    expect(account.password).toBe(params.password)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeNull()
  })

  it('should load an account by email', async () => {
    const params = mockAddAccountParams()
    const { insertedId } = await accountCollection.insertOne(params)
    const sut = makeSut()

    const account = await sut.loadByEmail(params.email)

    expect(account).not.toBeNull()
    expect(account).not.toHaveProperty('_id')
    expect(account?.email).toBe(params.email)
    expect(account?.id).toBe(insertedId.toString())
  })

  it('should update accessToken on updateAccessToken success', async () => {
    const params = mockAddAccountParams()
    const { insertedId: id } = await accountCollection.insertOne(params)
    let account = await accountCollection.findOne<AccountModel>({ _id: id })
    expect(account?.accessToken).toBeFalsy()

    const sut = makeSut()
    await sut.updateAccessToken(id.toString(), 'any_token')

    account = await accountCollection.findOne<AccountModel>({ _id: id })
    expect(account?.accessToken).toBe('any_token')
  })
})
