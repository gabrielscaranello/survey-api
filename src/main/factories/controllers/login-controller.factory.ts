import type { Controller } from '@/presentation/protocols'

import {
  makeDbAuthentication,
  makeErrorLogDecorator,
  makeLoginValidation
} from '@/main/factories'
import { LoginController } from '@/presentation/controllers'

export const makeLogin = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  )

  return makeErrorLogDecorator(loginController)
}
