import type {
  AddAccountRepository,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccountModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class AccountMongoRepository
  implements AddAccountRepository, LoadAccountByEmailRepository
{
  async add(data: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne({ ...data })
    return { ...data, id: insertedId.toString() }
  }

  async loadByEmail(_: string): Promise<AccountModel | null> {
    return await Promise.resolve(null)
  }
}
