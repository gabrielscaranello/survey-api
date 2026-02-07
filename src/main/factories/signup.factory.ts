import { DbAddAccount } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/criptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/account-repository'
import { SignupController } from '@/presentation/controllers'
import { EmailValidatorAdapter } from '@/utils'

export const makeSignUp = (): SignupController => {
  const salt = 12
  const emailValidator = new EmailValidatorAdapter()
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const accountRepository = new DbAddAccount(hasher, addAccountRepository)
  return new SignupController(emailValidator, accountRepository)
}
