import type { AddSurveyRepository } from '@/data/protocols'
import type { AddSurveyParams } from '@/domain/usecases'

import { MongoHelper } from '@/infra/db/mongodb/helpers'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add(params: AddSurveyParams): Promise<void> {
    const surveysCollection = MongoHelper.getCollection('surveys')
    await surveysCollection.insertOne(params)
  }
}
