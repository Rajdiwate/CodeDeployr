// Custom Error Class
export class AppError extends Error {
  public success: boolean;
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
