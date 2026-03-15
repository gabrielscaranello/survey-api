export type BodyValidationResult<T> =
  | { error: Error; body: null }
  | { error: null; body: T }
