import type { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeLogin, makeSignUp } from '@/main/factories'

export const authRoutes = (router: Router): void => {
  router.post('/auth/signup', adaptRoute(makeSignUp()))
  router.post('/auth/login', adaptRoute(makeLogin()))
}
