import type { Collection } from 'mongodb'

import type { AccountModel } from '@/domain/models'
import type { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

import { AccountMongoRepository } from './account-mongo.repository'

const makeAddAccountData = (): AddAccountModel => ({
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

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const sut = makeSut()
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeNull()
  })

  it('should load an account by email', async () => {
    const data = makeAddAccountData()
    const { insertedId } = await accountCollection.insertOne(data)
    const sut = makeSut()

    const account = await sut.loadByEmail(data.email)

    expect(account).not.toBeNull()
    expect(account).not.toHaveProperty('_id')
    expect(account?.email).toBe(data.email)
    expect(account?.id).toBe(insertedId.toString())
  })

  it('should update accessToken on updateAccessToken success', async () => {
    const data = makeAddAccountData()
    const { insertedId: id } = await accountCollection.insertOne(data)
    let account = await accountCollection.findOne<AccountModel>({ _id: id })
    expect(account?.accessToken).toBeFalsy()

    const sut = makeSut()
    await sut.updateAccessToken(id.toString(), 'any_token')

    account = await accountCollection.findOne<AccountModel>({ _id: id })
    expect(account?.accessToken).toBe('any_token')
  })
})
