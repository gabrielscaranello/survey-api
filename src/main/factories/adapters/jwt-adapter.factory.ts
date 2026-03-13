import type { Encrypter } from '@/data/protocols'
import { JWTAdapter } from '@/infra/criptography'
import { env } from '@/main/config/env'

export const makeJWTAdapater = (): Encrypter =>
  new JWTAdapter(env.app.jwtSecret)
