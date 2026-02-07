import { resolve } from 'node:path'
import { addAlias } from 'module-alias'

import { env } from './env'

export const setupModuleAlias = (): void => {
  addAlias('@', resolve(env.tsNodeDev ? 'src' : 'dist'))
}
