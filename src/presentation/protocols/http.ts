export enum HTTPStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  SERVER_ERROR = 500
}

export interface HttpRequest<T = any> {
  body?: T
}

export interface HttpResponse<T = any> {
  statusCode: HTTPStatusCode
  body: T
}
