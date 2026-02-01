import { ServerError } from '@/presentation/errors'
import { HTTPStatusCode, type HttpResponse } from '@/presentation/protocols'

export const ok = <T>(data: T): HttpResponse<T> => ({
  body: data,
  statusCode: HTTPStatusCode.OK
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: HTTPStatusCode.BAD_REQUEST,
  body: error
})

export const serverError = (): HttpResponse<Error> => ({
  statusCode: HTTPStatusCode.SERVER_ERROR,
  body: new ServerError()
})
