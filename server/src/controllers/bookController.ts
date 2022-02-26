import { Request, Response } from "express";
import puppeteer from "puppeteer-core";
import config from "../config";
import GlobalStore from "../global/globalStore";
import {
  amazonAddToCartButton,
  amazonCheckotId,
  goodReadBuyButtonId,
} from "./constants";

const recommendBook = async (req: Request, res: Response) => {
  const url = req.body.genreUrl;
  try {
    const browser = await puppeteer.launch({
      ...config.PUPPETEER_OPTIONS,
      headless: true,
    });
    const page = (await browser.pages())[0];
    await page.setViewport({ width: 0, height: 0 });
    await page.setUserAgent(config.USER_AGAENT);

    //goto url of top books by genre
    await page.goto(config.GOOD_READ_URL + url);

    console.log("waitForSelector");
    await page.waitForSelector(".pollContents");

    console.log("crawlling genres");
    const books = await page.$$eval(
      ".inlineblock.pollAnswer.resultShown > .answerWrapper a",
      (types) => types.map((type) => type.getAttribute("id"))
    );

    console.log("ids", books);
    if (books.length === 0) {
      return res.status(400).send({ message: "No books found" });
    }
    const randomBook = books[Math.floor(Math.random() * books.length)];

    //goto random book url and pick amazon url
    await page.click("#" + randomBook);
    // await page.waitForNavigation();
    await page.waitForSelector(goodReadBuyButtonId);
    const amazonUrl = await page.$eval(goodReadBuyButtonId, (el) =>
      el.getAttribute("href")
    );
    console.log(amazonUrl);
    await browser.close();

    //open seperate browser to for amazon
    const visibleBrowser = await puppeteer.launch({
      ...config.PUPPETEER_OPTIONS,
      headless: false,
    });
    const amazonPage = (await visibleBrowser.pages())[0];
    await amazonPage.setViewport({ width: 0, height: 0 });
    await amazonPage.setUserAgent(config.USER_AGAENT);
    await amazonPage.goto(config.GOOD_READ_URL + amazonUrl, {
      waitUntil: "networkidle2",
    });
    if (amazonPage.url().includes("https://www.amazon.com/s")) {
      await amazonPage.waitForSelector(".s-result-list.s-search-results");

      await amazonPage.click(".s-result-list.s-search-results > div a");
    }
    try {
      await amazonPage.waitForSelector(amazonAddToCartButton);
    } catch {
      return res.status(400).send({ message: "Book not available on Amazon" });
    }
    await amazonPage.click(amazonAddToCartButton);
    try {
      await amazonPage.waitForSelector(amazonCheckotId);
    } catch {
      return res.status(400).send({ message: "Checkout button not available" });
    }
    await amazonPage.click(amazonCheckotId);

    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Something went wrong" });
  }
};

const getGenres = async (_, res: Response) => {
  const oldGenres = GlobalStore.getInstance().get("genres");
  if (oldGenres) {
    res.json(oldGenres);
  }
  try {
    const browser = await puppeteer.launch(config.PUPPETEER_OPTIONS);
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(config.GOOD_READ_URL + "/choiceawards/best-books-2020");

    console.log("waitForSelector");
    await page.waitForSelector(".categoryContainer");

    console.log("crawlling genres");
    const genres = await page.$$eval(".category > a", (types) => {
      return types.map((type) => {
        return {
          name: type.textContent.replace(/\n/g, "").trim(),
          url: type.getAttribute("href"),
        };
      });
    });

    await browser.close();
    GlobalStore.getInstance().set("genres", genres);
    res.json(genres);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message || "Something went wrong" });
  }
};

export { recommendBook, getGenres };
