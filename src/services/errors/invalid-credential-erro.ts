export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email/Password incorrect');
  }
}
