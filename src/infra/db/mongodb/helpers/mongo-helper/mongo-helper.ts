import { MongoClient, type Collection } from 'mongodb'

let _client: null | MongoClient = null
let _connecting = false

export const MongoHelper = {
  get client(): MongoClient | null {
    return _client
  },

  get connecting(): boolean {
    return _connecting
  },

  async connect(uri: string): Promise<void> {
    if (_connecting || _client) {
      return
    }

    try {
      _connecting = true
      const client = await MongoClient.connect(uri)
      _client ??= client
    } finally {
      _connecting &&= false
    }
  },

  async disconnect(): Promise<void> {
    if (!this.client) {
      return
    }
    await this.client.close()
    _client = null
    _connecting = false
  },

  getCollection(name: string): Collection {
    if (!this.client) {
      throw new Error('MongoClient not connected')
    }
    return this.client.db().collection(name)
  }
}
