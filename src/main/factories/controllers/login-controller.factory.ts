import {
  makeDbAuthentication,
  makeErrorLogDecorator,
  makeLoginValidation
} from '@/main/factories'
import { LoginController } from '@/presentation/controllers'
import type { Controller } from '@/presentation/protocols'

export const makeLogin = (): Controller => {
  const loginController = new LoginController(
    makeDbAuthentication(),
    makeLoginValidation()
  )

  return makeErrorLogDecorator(loginController)
}
