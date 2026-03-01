import type {
  HashComparer,
  LoadAccountByEmailRepository,
  TokenGenerator
} from '@/data/protocols'
import type { Authentication, AuthenticationParams } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth(params: AuthenticationParams): Promise<string | null> {
    const { email, password } = params

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null

    await this.hashComparer.compare(password, account.password)
    await this.tokenGenerator.generateToken(account.id)
    return null
  }
}
