import { EmailInUseError } from '@/domain/errors'

import type {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from './db-add-account.protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(data: AddAccountModel): Promise<AccountModel> {
    const { email, password } = data
    const exists = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (exists) {
      throw new EmailInUseError()
    }

    const hashedPassword = await this.hasher.hash(password)
    const account = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword
    })

    return account
  }
}
