import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../errors/NotFoundError";
import { ValidationError } from "../../errors/ValidationError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    return res.status(400).send({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).send({ message: err.message });
  }

  return res.status(500).send({ message: "Internal Server Error" });
};
