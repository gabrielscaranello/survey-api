import type { Controller } from '@/presentation/protocols'

import { makeDbAuthentication, makeErrorLogDecorator } from '@/main/factories'
import { LoginController } from '@/presentation/controllers'

import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  )

  return makeErrorLogDecorator(loginController)
}
