/* eslint-disable @typescript-eslint/no-magic-numbers -- env file */
export const env = {
  app: {
    port: get(process.env.PORT, 3000),
    tsNodeDev: get(process.env.TS_NODE_DEV, false)
  },
  db: {
    mongourl: get(process.env.MONGODB_URL, '')
  }
}

function get(value: string | undefined, fallback: string): string
function get(value: string | undefined, fallback: number): number
function get(value: string | undefined, fallback: boolean): boolean
function get(
  value: string | undefined,
  fallback: string | number | boolean
): string | number | boolean {
  if (value === undefined || value === '') {
    return fallback
  }

  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  if (!isNaN(Number(value))) {
    return Number(value)
  }

  return value
}
