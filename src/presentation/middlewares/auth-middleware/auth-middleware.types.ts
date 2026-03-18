import type { HttpResponse } from '@/presentation/protocols'

interface Account {
  accountId: string
}

export type AuthMiddlewareResult = HttpResponse<Account | Error>
