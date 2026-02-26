import { afterAll, beforeAll } from 'vitest'
import { setup, teardown } from 'vitest-mongodb'

beforeAll(async () => {
  await setup({
    serverOptions: {
      binary: {
        version: '8.2.5',
        platform: 'linux',
        arch: 'x64',
        checkMD5: false,
        os: { dist: 'ubuntu', os: 'linux', release: '24.04' }
      }
    }
  })
})

afterAll(async () => {
  await teardown()
})
