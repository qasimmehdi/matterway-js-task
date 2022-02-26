import { NextFunction, Request, Response } from "express";
import { recommendShema } from "../schemas/books";

const validateRecommendBooks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    recommendShema.validateSync(req.body, { strict: true });
  } catch ({ message, errors }) {
    return res.status(400).send({ message, errors });
  }

  next();
  console.log();
};

export { validateRecommendBooks };
