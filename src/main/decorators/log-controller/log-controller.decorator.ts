import type { LogErrorRepository } from '@/data/protocols'
import {
  HTTPStatusCode,
  type Controller,
  type HttpRequest,
  type HttpResponse
} from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    await this.handleLogError(httpResponse)
    return httpResponse
  }

  private async handleLogError(res: HttpResponse): Promise<void> {
    if (res.statusCode !== HTTPStatusCode.SERVER_ERROR) {
      return
    }

    if (!(res.body instanceof Error) || !res.body.stack) {
      return
    }

    await this.logErrorRepository.logError(res.body.stack)
  }
}
