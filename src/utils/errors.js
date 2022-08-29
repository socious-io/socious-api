export class AuthorizationError extends Error {
  status = 401;
}
export class PermissionError extends Error {
  status = 403;
}
export class BadRequestError extends Error {
  status = 400;
}
export class ValidationError extends Error {
  status = 400;
}
export class EntryError extends Error {
  status = 400;
}
export class NotMatchedError extends Error {
  message = 'not matched';
  status = 400;
}
export class UnauthorizedError extends Error {
  message = 'Unauthorized';
  status = 401;
}

export class ManyRequestsError extends Error {
  message = 'many requests';
  status = 429;
}
