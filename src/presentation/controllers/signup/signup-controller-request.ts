import type { AddAccountModel } from '@/domain/usecases'

export interface SignUpRequest extends AddAccountModel {
  passwordConfirmation: string
}
