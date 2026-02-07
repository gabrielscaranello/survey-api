export const env = {
  port: parseInt(process.env.PORT ?? '5050', 10),
  tsNodeDev: !!process.env.TS_NODE_DEV
}
