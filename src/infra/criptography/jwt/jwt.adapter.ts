import { sign } from 'jsonwebtoken'

import type { Encrypter } from '@/data/protocols'

export class JWTAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    sign({ id: value }, this.secret)
    return await Promise.resolve('')
  }
}
