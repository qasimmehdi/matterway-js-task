import { Response, Router } from "express";
import { getGenres, recommendBook } from "../controllers/bookController";
import { validateRecommendBooks } from "../middlewares/validateRecommendBooks";

const books = Router();

books.get("/genres", getGenres);
books.post("/recommend", validateRecommendBooks, recommendBook);

export default books;
