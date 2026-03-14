import { Router } from 'express'

import type { Express } from 'express'

import { authRoutes, surveyRoutes } from '@/main/routes'

const routes = [authRoutes, surveyRoutes]

export const setupRoutes = (app: Express): void => {
  const router = Router()

  for (const setupRoute of routes) {
    setupRoute(router)
  }

  app.use('/api', router)
}
