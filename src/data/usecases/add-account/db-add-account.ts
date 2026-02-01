import type {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher
} from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add(data: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(data.password)
    await this.addAccountRepository.add({ ...data, password: hashedPassword })

    return await Promise.resolve({
      id: 'any_id',
      name: data.name,
      email: data.email,
      password: data.password
    })
  }
}
