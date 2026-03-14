import type { AddAccountParams } from '@/domain/usecases'

export interface SignUpRequest extends AddAccountParams {
  passwordConfirmation: string
}
