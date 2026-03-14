import type { LogErrorRepository } from '@/data/protocols'

import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const collection = MongoHelper.getCollection('errors')
    await collection.insertOne({ stack, date: new Date() })
  }
}
