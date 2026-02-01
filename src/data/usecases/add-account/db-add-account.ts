import type {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Hasher
} from './db-add-account.protocols'

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
