import type { AddAccountModel } from './signup.protocols'

export * from '@/presentation/protocols'
export type * from '@/domain/usecases/add-account'
export type * from '@/domain/models/account'
export type * from '@/presentation/protocols/email-validator'

export interface SignUpRequest extends AddAccountModel {
  passwordConfirmation: string
}
