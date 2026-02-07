import type { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeSignUp } from '@/main/factories'

export const signupRoutes = (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUp()))
}
