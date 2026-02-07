import { Router, type Express } from 'express'

import { signupRoutes } from '@/main/routes'

const routes = [signupRoutes]

export const setupRoutes = (app: Express): void => {
  const router = Router()

  for (const setupRoute of routes) {
    setupRoute(router)
  }

  app.use('/api', router)
}
