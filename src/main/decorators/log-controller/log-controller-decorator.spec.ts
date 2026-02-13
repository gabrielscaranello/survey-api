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

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(_: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(makeHttpResponse())
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return { sut, controllerStub }
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
})
