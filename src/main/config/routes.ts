import { Router, type Express } from 'express'

import { authRoutes } from '@/main/routes'

const routes = [authRoutes]

export const setupRoutes = (app: Express): void => {
  const router = Router()

  for (const setupRoute of routes) {
    setupRoute(router)
  }

  app.use('/api', router)
}
