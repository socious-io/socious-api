export class AuthorizationError extends Error {}
export class BadRequestError extends Error {}
export class ValidationError extends Error {}
export class EntryError extends Error {}
export class NotMatchedError extends Error {
  message = 'not matched';
}
