import { DbAuthentication } from '@/data/usecases'
import type { Authentication } from '@/domain/usecases'
import { AccountMongoRepository } from '@/infra/db/mongodb'
import { makeBcryptAdapter, makeJWTAdapater } from '@/main/factories'

export const makeDbAuthentication = (): Authentication => {
  const accountRepository = new AccountMongoRepository()

  return new DbAuthentication(
    accountRepository,
    makeBcryptAdapter(),
    makeJWTAdapater(),
    accountRepository
  )
}
