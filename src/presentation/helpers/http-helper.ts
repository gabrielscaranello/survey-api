import { ServerError } from '../errors'
import { HTTPStatusCode, type HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: HTTPStatusCode.BAD_REQUEST,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: HTTPStatusCode.SERVER_ERROR,
  body: new ServerError()
})
