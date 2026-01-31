import { HTTPStatusCode, type HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: HTTPStatusCode.BAD_REQUEST,
  body: error
})
