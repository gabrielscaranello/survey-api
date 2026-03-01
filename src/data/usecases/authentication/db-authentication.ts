import type { LoadAccountByEmailRepository } from '@/data/protocols'
import type { Authentication, AuthenticationParams } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth(params: AuthenticationParams): Promise<string | null> {
    await this.loadAccountByEmailRepository.loadByEmail(params.email)
    return null
  }
}
