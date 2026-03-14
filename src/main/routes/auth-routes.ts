import type { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/factories'

export const authRoutes = (router: Router): void => {
  router.post('/auth/signup', adaptRoute(makeSignUpController()))
  router.post('/auth/login', adaptRoute(makeLoginController()))
}
