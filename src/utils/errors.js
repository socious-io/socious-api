export class AuthorizationError extends Error {
  status = 401
}
export class PermissionError extends Error {
  message = 'Not allow'
  status = 403
}
export class BadRequestError extends Error {
  status = 400
}

export class NotFoundError extends Error {
  message = 'Not found'
  status = 404
}

export class ConflictError extends Error {
  message = 'Conflict'
  status = 409
}

export class ValidationError extends Error {
  status = 400
}
export class EntryError extends Error {
  status = 400
}
export class NotMatchedError extends Error {
  message = 'Not matched'
  status = 400
}
export class UnauthorizedError extends Error {
  message = 'Unauthorized'
  status = 401
}

export class TooManyRequestsError extends Error {
  message = 'Too many requests'
  status = 429
}

export class NotImplementedError extends Error {
  message = 'Not implemented'
  status = 501
}
