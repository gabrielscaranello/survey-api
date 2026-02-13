import type { Request, Response } from 'express'

import { ServerError } from '@/presentation/errors'
import {
  HTTPStatusCode,
  type Controller,
  type HttpRequest
} from '@/presentation/protocols'

export const adaptRoute =
  (controller: Controller) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment --
       * It's needed because Express Request body doesn't support type assertions
       * and is necessary to map {req.body} data */
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === HTTPStatusCode.OK) {
      return res.status(httpResponse.statusCode).send(httpResponse.body)
    }

    const error =
      httpResponse.body instanceof Error ? httpResponse.body : new ServerError()

    return res.status(httpResponse.statusCode).send({ error: error.message })
  }
