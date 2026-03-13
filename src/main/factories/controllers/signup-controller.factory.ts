import {
  makeDbAddAccount,
  makeDbAuthentication,
  makeErrorLogDecorator,
  makeSignupValidation
} from '@/main/factories'
import { SignupController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeSignUp = (): Controller => {
  const signupController = new SignupController(
    makeDbAddAccount(),
    makeSignupValidation(),
    makeDbAuthentication()
  )

  return makeErrorLogDecorator(signupController)
}
