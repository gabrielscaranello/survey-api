import type { AddAccountModel } from './signup-controller.protocols'

export interface SignUpRequest extends AddAccountModel {
  passwordConfirmation: string
}
