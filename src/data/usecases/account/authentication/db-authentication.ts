import type {
  Encrypter,
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import type { Authentication, AuthenticationParams } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(params: AuthenticationParams): Promise<string | null> {
    const { email, password } = params

    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) return null

    const isValid = await this.hashComparer.compare(password, account.password)
    if (!isValid) return null

    const token = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, token)

    return token
  }
}
