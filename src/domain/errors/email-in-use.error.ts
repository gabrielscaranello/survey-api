export class EmailInUseError extends Error {
  constructor() {
    super('The received e-mail already in use')
    this.name = 'EmailInUseError'
  }
}
