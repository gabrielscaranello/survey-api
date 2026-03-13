import { ObjectId } from 'mongodb'

import type {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccountModel } from '@/domain/usecases'
import type { WithId } from 'mongodb'

import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class AccountMongoRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(data: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...data })
    return { ...data, id: insertedId.toString() }
  }

  async loadByEmail(email: string): Promise<AccountModel | null> {
    const collection = MongoHelper.getCollection('accounts')
    const account = await collection.findOne<WithId<AccountModel>>({ email })
    return MongoHelper.mapResult(account)
  }

  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const collection = MongoHelper.getCollection('accounts')
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken } }
    )
  }
}
