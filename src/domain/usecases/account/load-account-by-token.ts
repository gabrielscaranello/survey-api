import type { AccountModel } from '@/domain/models'

export interface LoadAccountByToken {
  load: (accessToken: string, roles?: string[]) => Promise<AccountModel>
}
