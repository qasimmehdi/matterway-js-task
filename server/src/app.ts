import express from "express";
import books from "./routes/books";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));

app.use("/books", books);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
