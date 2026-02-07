import { env } from './config/env'
import { setupModuleAlias } from './config/module-alias'

const main = async (): Promise<void> => {
  setupModuleAlias()

  const { app } = await import('./config/app')

  app.listen(env.port, () => {
    process.stdout.write(`Server running at http://localhost:${env.port}\n`)
  })
}

void main()
