import type { Hasher } from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccount, AddAccountModel } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor(private readonly hasher: Hasher) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.hasher.hash(account.password)
    return await Promise.resolve({
      id: 'any_id',
      name: account.name,
      email: account.email,
      password: account.password
    })
  }
}
