import { DbAddAccount, DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JWTAdapter } from '@/infra/criptography'
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb'
import { env } from '@/main/config/env'
import { LogControllerDecorator } from '@/main/decorators'
import { makeSignupValidation } from '@/main/factories'
import { SignupController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeSignUp = (): Controller => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const addAccount = new DbAddAccount(hasher, accountRepository)
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JWTAdapter(env.app.jwtSecret)

  const authentication = new DbAuthentication(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )

  const signupController = new SignupController(
    addAccount,
    makeSignupValidation(),
    authentication
  )
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logErrorRepository)
}
