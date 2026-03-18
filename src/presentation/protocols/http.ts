export enum HTTPStatusCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  SERVER_ERROR = 500
}

export interface HttpRequest<T = any> {
  body?: T
  headers?: Record<string, string>
}

export interface HttpResponse<T = any> {
  statusCode: HTTPStatusCode
  body?: T
}
