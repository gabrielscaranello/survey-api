import { afterAll, beforeAll } from 'vitest'
import { setup, teardown } from 'vitest-mongodb'

beforeAll(async () => {
  await setup({
    serverOptions: { binary: { version: '8.2.5', checkMD5: false } }
  })
})

afterAll(async () => {
  await teardown()
})
