export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Post not found") {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(details) {
    super(400, "Validation failed", details);
  }
}
