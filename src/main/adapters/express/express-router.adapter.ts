import type { Controller, HttpRequest } from '@/presentation/protocols'
import type { Request, Response } from 'express'

import { ServerError } from '@/presentation/errors'
import { HTTPStatusCode } from '@/presentation/protocols'

const successStatus = [HTTPStatusCode.OK, HTTPStatusCode.NO_CONTENT]

export const adaptRoute =
  (controller: Controller) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment --
       * It's needed because Express Request body doesn't support type assertions
       * and is necessary to map {req.body} data */
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    if (successStatus.includes(httpResponse.statusCode)) {
      return res.status(httpResponse.statusCode).send(httpResponse.body)
    }

    const error =
      httpResponse.body instanceof Error ? httpResponse.body : new ServerError()

    return res.status(httpResponse.statusCode).send({ error: error.message })
  }
