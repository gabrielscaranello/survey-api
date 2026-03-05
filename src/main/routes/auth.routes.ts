import type { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeSignUp } from '@/main/factories'

export const authRoutes = (router: Router): void => {
  router.post('/auth/signup', adaptRoute(makeSignUp()))
}
