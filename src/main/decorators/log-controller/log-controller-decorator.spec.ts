import type { LogErrorRepository } from '@/data/protocols'
import { serverError } from '@/presentation/helpers'
import {
  HTTPStatusCode,
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '@/presentation/protocols'

import { LogControllerDecorator } from './log-controller.decorator'

const makeHttpRequest = (): HttpRequest => ({
  body: { foo: 'bar' }
})

const makeHttpResponse = (): HttpResponse => ({
  statusCode: HTTPStatusCode.OK,
  body: { foo: 'bar' }
})

const makeError = (): Error => {
  const error = new Error()
  error.stack = 'any_stack'
  return error
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(_: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(makeHttpResponse())
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(_stack: string): Promise<void> {
      await Promise.resolve()
    }
  }

  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  it('should call controller handle', async () => {
    const httpRequest = makeHttpRequest()
    const { sut, controllerStub } = makeSut()
    const handleSpy = vi.spyOn(controllerStub, 'handle')

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const httpRequest = makeHttpRequest()
    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(makeHttpResponse())
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const error = makeError()
    vi.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(error))
    const logSpy = vi.spyOn(logErrorRepositoryStub, 'logError')

    await sut.handle(makeHttpRequest())

    expect(logSpy).toHaveBeenCalledWith(error.stack)
  })
})
