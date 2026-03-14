import type {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository
} from '@/data/protocols'
import type { AccountModel } from '@/domain/models'
import type { AddAccount, AddAccountParams } from '@/domain/usecases'

import { EmailInUseError } from '@/domain/errors'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add(params: AddAccountParams): Promise<AccountModel> {
    const { email, password } = params
    const exists = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (exists) {
      throw new EmailInUseError()
    }

    const hashedPassword = await this.hasher.hash(password)
    const account = await this.addAccountRepository.add({
      ...params,
      password: hashedPassword
    })

    return account
  }
}
