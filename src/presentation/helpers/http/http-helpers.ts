import type { HttpResponse } from '@/presentation/protocols'

import { ServerError, UnauthorizedError } from '@/presentation/errors'
import { HTTPStatusCode } from '@/presentation/protocols'

export const ok = <T>(data: T): HttpResponse<T> => ({
  body: data,
  statusCode: HTTPStatusCode.OK
})

export const noContent = (): HttpResponse<null> => ({
  statusCode: HTTPStatusCode.NO_CONTENT,
  body: null
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: HTTPStatusCode.BAD_REQUEST,
  body: error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: HTTPStatusCode.UNAUTHORIZED,
  body: new UnauthorizedError()
})

export const forbidden = (error: Error): HttpResponse<Error> => ({
  statusCode: HTTPStatusCode.FORBIDDEN,
  body: error
})

export const serverError = (error: unknown): HttpResponse<Error> => ({
  statusCode: HTTPStatusCode.SERVER_ERROR,
  body: new ServerError(error instanceof Error ? error.stack : '')
})
