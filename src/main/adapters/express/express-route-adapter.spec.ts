import type { Controller, HttpResponse } from '@/presentation/protocols'
import type { Request, Response } from 'express'

import { ServerError } from '@/presentation/errors'
import { badRequest, ok } from '@/presentation/helpers/http'
import { HTTPStatusCode } from '@/presentation/protocols'

import { adaptRoute } from './express-router.adapter'

const mockHttpResponse = (): HttpResponse<Record<string, string>> =>
  ok({ anything: 'any_value' })

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(): Promise<HttpResponse> {
      return await Promise.resolve(mockHttpResponse())
    }
  }

  return new ControllerStub()
}

const makeFakeRequest = (body: Record<string, string>): Request => {
  const req = { body }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- will be mock Express Request
  return req as Request
}

const mockSend = vi.fn()
const mockStatus = vi.fn()
const makeFakeResponse = (): Response => {
  const res = {
    status(value: number) {
      mockStatus(value)
      return this
    },

    send(content: Record<string, string>) {
      mockSend(content)
      return content
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- will be mock Express Response
  return res as unknown as Response
}

const mockBody = (): Record<string, string> => ({ anything: 'any_value' })

interface SutTypes {
  sut: ReturnType<typeof adaptRoute>
  controllerStub: Controller
  requestStub: Request
  responseStub: Response
}

const makeSut = (): SutTypes => {
  const controllerStub = mockController()
  const requestStub = makeFakeRequest(mockBody())
  const responseStub = makeFakeResponse()
  const sut = adaptRoute(controllerStub)

  return { sut, controllerStub, requestStub, responseStub }
}

describe('Express Route Adapter', () => {
  it('should call controller with correct request', async () => {
    const { sut, controllerStub, requestStub, responseStub } = makeSut()
    const handleSpy = vi.spyOn(controllerStub, 'handle')

    await sut(requestStub, responseStub)

    expect(handleSpy).toHaveBeenCalledWith({ body: mockBody() })
  })

  it('should return same result of the controller with status code 200', async () => {
    const { statusCode, body } = mockHttpResponse()
    const { sut, requestStub, responseStub } = makeSut()

    const result = await sut(requestStub, responseStub)

    expect(result).toEqual(body)
    expect(mockStatus).toHaveBeenCalledWith(statusCode)
    expect(mockSend).toHaveBeenCalledWith(body)
  })

  it('should return internal server error message when controller provide error', async () => {
    const error = new Error('any_error')
    const httpResponse = badRequest(error)
    const { sut, requestStub, responseStub, controllerStub } = makeSut()
    vi.spyOn(controllerStub, 'handle').mockResolvedValueOnce(httpResponse)

    const result = await sut(requestStub, responseStub)

    expect(result).toEqual({ error: error.message })
    expect(mockStatus).toHaveBeenCalledWith(httpResponse.statusCode)
    expect(mockSend).toHaveBeenCalledWith({ error: error.message })
  })

  it('should return internal server error message when controller do not provide error', async () => {
    const httpResponse = { statusCode: HTTPStatusCode.FORBIDDEN }
    const { sut, requestStub, responseStub, controllerStub } = makeSut()
    vi.spyOn(controllerStub, 'handle').mockResolvedValueOnce(httpResponse)

    const result = await sut(requestStub, responseStub)

    expect(result).toEqual({ error: new ServerError().message })
  })
})
