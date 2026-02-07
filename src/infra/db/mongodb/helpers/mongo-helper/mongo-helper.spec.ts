import { MongoHelper } from './mongo-helper'

const mockedConnect = vi.fn()
const mockedClose = vi.fn()
const mockedCollection = vi.fn().mockReturnValue({})

vi.mock('mongodb', () => ({
  MongoClient: {
    connect: (...args: []): any => mockedConnect(...args)
  }
}))

describe('Mongo Helper', () => {
  const mockedClient = {
    close: (...args: []): any => mockedClose(...args),
    db: () => ({
      collection: (...args: []): any => mockedCollection(...args)
    })
  }

  beforeAll(() => {
    mockedConnect.mockImplementation(() => mockedClient)
  })

  describe('connect', () => {
    it('should call connect with correct uri', async () => {
      await MongoHelper.connect('any_url')

      expect(mockedConnect).toHaveBeenCalledWith('any_url')
      await MongoHelper.disconnect()
    })

    it('should define client on success', async () => {
      await MongoHelper.connect('any_url')

      expect(MongoHelper.client).toEqual(mockedClient)
      await MongoHelper.disconnect()
    })

    it('should throw if MongoClient throws', async () => {
      mockedConnect.mockRejectedValueOnce(new Error('test error'))

      const promise = MongoHelper.connect('any_url')

      await expect(promise).rejects.toThrow()
    })

    it('should no make multiple connections when connect is called multiple times', async () => {
      await MongoHelper.connect('any_url')
      await MongoHelper.connect('any_url')

      expect(mockedConnect).toHaveBeenCalledTimes(1)
    })
  })

  describe('disconnect', () => {
    it('should call client.close', async () => {
      await MongoHelper.connect('any_url')
      await MongoHelper.disconnect()

      expect(mockedClose).toHaveBeenCalled()
      expect(MongoHelper.client).toBeNull()
      expect(MongoHelper.connecting).toBe(false)
    })

    it('should no call client.close if client is not defined', async () => {
      await MongoHelper.disconnect()

      expect(mockedClose).not.toHaveBeenCalled()
    })

    it('should throw if client.close throws', async () => {
      await MongoHelper.connect('any_url')
      mockedClose.mockRejectedValueOnce(new Error('test error'))

      const promise = MongoHelper.disconnect()

      await expect(promise).rejects.toThrow()
      await MongoHelper.disconnect()
    })
  })

  describe('getCollection', () => {
    it('should throw if client is not defined', async () => {
      const callback = (): any => MongoHelper.getCollection('any_collection')

      expect(callback).toThrow()
      await MongoHelper.disconnect()
    })

    it('should call client.db with correct values', async () => {
      await MongoHelper.connect('any_url')
      MongoHelper.getCollection('any_collection')

      expect(mockedCollection).toHaveBeenCalledWith('any_collection')
      await MongoHelper.disconnect()
    })

    it('should throw if client.db() throws', async () => {
      await MongoHelper.connect('any_url')
      mockedCollection.mockImplementationOnce(() => {
        throw new Error()
      })

      const callback = (): any => MongoHelper.getCollection('any_collection')

      expect(callback).toThrow()
      await MongoHelper.disconnect()
    })
  })
})
