import type { Router } from 'express'

export const signupRoutes = (router: Router): void => {
  router.post('/signup', (_, res) => res.json({}))
}
