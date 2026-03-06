import { DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JWTAdapter } from '@/infra/criptography'
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb'
import { env } from '@/main/config/env'
import { LogControllerDecorator } from '@/main/decorators'
import { makeLoginValidation } from '@/main/factories'
import { LoginController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeLogin = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  const jwtAdapter = new JWTAdapter(env.app.jwtSecret)
  const authentication = new DbAuthentication(
    accountRepository,
    bcryptAdapter,
    jwtAdapter,
    accountRepository
  )

  const loginController = new LoginController(
    authentication,
    makeLoginValidation()
  )
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}
