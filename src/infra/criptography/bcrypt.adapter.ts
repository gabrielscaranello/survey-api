import { compare, hash } from 'bcrypt'

import type { HashComparer, Hasher } from '@/data/protocols'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hashedValue = await hash(value, this.salt)
    return hashedValue
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    const result = await compare(value, hashedValue)
    return result
  }
}
