import { HttpError } from "./HttpError";

export class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}
