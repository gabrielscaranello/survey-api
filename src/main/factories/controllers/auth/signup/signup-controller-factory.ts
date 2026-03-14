import type { Controller } from '@/presentation/protocols'

import {
  makeDbAddAccount,
  makeDbAuthentication,
  makeErrorLogDecorator
} from '@/main/factories'
import { SignupController } from '@/presentation/controllers'

import { makeSignupValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const signupController = new SignupController(
    makeDbAddAccount(),
    makeSignupValidation(),
    makeDbAuthentication()
  )

  return makeErrorLogDecorator(signupController)
}
