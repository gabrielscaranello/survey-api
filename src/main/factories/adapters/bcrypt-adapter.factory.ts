import type { HashComparer, Hasher } from '@/data/protocols'
import { BcryptAdapter } from '@/infra/criptography'

export const makeBcryptAdapter = (): Hasher & HashComparer => {
  const salt = 12
  return new BcryptAdapter(salt)
}
