import { hash } from 'bcrypt'

import type { Hasher } from '@/data/protocols'

export class BcryptAdapter implements Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    await hash(value, this.salt)
    return await Promise.resolve(value)
  }
}
