export class LateCheckInError extends Error {
  constructor() {
    super(
      'The check-in can only be validated until 20 minutes after it was created'
    );
  }
}
