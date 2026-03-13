import { DbAddAccount } from '@/data/usecases'
import type { AddAccount } from '@/domain/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { makeBcryptAdapter } from '@/main/factories'

export const makeDbAddAccount = (): AddAccount => {
  const accountRepository = new AccountMongoRepository()

  return new DbAddAccount(
    makeBcryptAdapter(),
    accountRepository,
    accountRepository
  )
}
