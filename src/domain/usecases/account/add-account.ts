import type { AccountModel } from '@/domain/models'

export type AddAccountParams = Omit<AccountModel, 'id' | 'accessToken'>

export interface AddAccount {
  add: (params: AddAccountParams) => Promise<AccountModel>
}
