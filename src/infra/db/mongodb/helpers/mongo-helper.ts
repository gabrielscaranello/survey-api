import { MongoClient, type Collection } from 'mongodb'

export const MongoHelper = {
  client: null as null | MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    await this.client?.close()
    this.client = null
  },

  getCollection(name: string): Collection {
    if (!this.client) {
      throw new Error('Error to connect to db')
    }
    return this.client.db().collection(name)
  }
}
