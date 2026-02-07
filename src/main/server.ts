import { env } from './config/env'
import { setupModuleAlias } from './config/module-alias'

const main = async (): Promise<void> => {
  setupModuleAlias()

  const { MongoHelper } = await import('@/infra/db/mongodb/helpers')
  const { app } = await import('./config/app')

  await MongoHelper.connect(env.db.mongourl)

  app.listen(env.app.port, () => {
    process.stdout.write(`Server running at http://localhost:${env.app.port}\n`)
  })
}

void main()
