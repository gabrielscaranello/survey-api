import type { Router } from 'express'

import { adaptRoute } from '@/main/adapters'
import { makeAddSurveyController } from '@/main/factories'

export const surveyRoutes = (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
