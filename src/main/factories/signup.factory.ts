import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository, LogMongoRepository } from '@/infra/db/mongodb'
import { LogControllerDecorator } from '@/main/decorators'
import { SignupController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/utils'

import { makeSignupValidation } from './signup-validation.factory'

export const makeSignUp = (): Controller => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)

  const emailValidator = new EmailValidatorAdapter()
  const addAccountRepository = new AccountMongoRepository()
  const accountRepository = new DbAddAccount(hasher, addAccountRepository)

  const signupController = new SignupController(
    emailValidator,
    accountRepository,
    makeSignupValidation()
  )
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, logErrorRepository)
}
