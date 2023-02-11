import { HttpError } from "./HttpError";

export class ValidationError extends HttpError {
  constructor(message = "Invalid input data") {
    super(message, 400);
  }
}
