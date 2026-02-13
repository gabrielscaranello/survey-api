import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { LogControllerDecorator } from '@/main/decorators'
import { SignupController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'
import { EmailValidatorAdapter } from '@/utils'

export const makeSignUp = (): Controller => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const accountRepository = new DbAddAccount(hasher, addAccountRepository)
  const signupController = new SignupController(
    emailValidator,
    accountRepository
  )
  return new LogControllerDecorator(signupController)
}
