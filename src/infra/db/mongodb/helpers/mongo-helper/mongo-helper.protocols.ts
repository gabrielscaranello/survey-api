import type { WithId } from 'mongodb'

export type MongoMapResult<T> = Omit<WithId<T>, '_id'> & { id: string }
