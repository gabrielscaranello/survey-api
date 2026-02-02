import { MongoClient, type Collection } from 'mongodb'

let _client: null | MongoClient = null

export const MongoHelper = {
  get client(): MongoClient | null {
    return _client
  },

  async connect(uri: string): Promise<void> {
    _client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    if (!this.client) {
      return
    }
    await this.client.close()
    _client = null
  },

  getCollection(name: string): Collection {
    if (!this.client) {
      throw new Error('MongoClient not connected')
    }
    return this.client.db().collection(name)
  }
}
