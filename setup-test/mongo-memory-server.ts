import { afterAll, beforeAll } from 'vitest'
import { setup, teardown } from 'vitest-mongodb'

beforeAll(async () => {
  await setup({
    serverOptions: { binary: { version: '7.0.3', checkMD5: false } }
  })
})

afterAll(async () => {
  await teardown()
})
