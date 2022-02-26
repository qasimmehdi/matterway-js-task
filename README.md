# Server
## Stack: node, typescript, express, puppeteer
## How to run:
```
cd server
npm i
npm run dev
```
### How it works:
- Server is responsible for fetching genres and picking a random book from the selected genre.
- For a list of genres the server runs a headless chrome instance and scrapes the list of genres from the goodread and saves it to GlobalStore for future use.
- For picking a random book server open the genre page which usually has 20 books and picks a random book from that and opens the page for that book by clicking on it.
- After the book page opens server will find the Amazon URL from the page and open it in a new visible window.
- On amazon URL, we have two types:
    - The URL is of a search listing page that has multiple books listed.
    - The URL is of a product page.
- Server matches the window URL with `https://www.amazon.com/s` to determine that the page will have a product listing and then it clicks on the first book.
- If the Amazon URL was of a product the above step will be skipped.
- On the product page the server will find Add to Cart button and click on it.
- Then the page will be redirected to the cart page where the server will find Proceed to Checkout button and click on it for the checkout page.
- For the frontend, there are two APIs exposed using express
    - Get all genres, returns a list of genres.
    - Recommend book, finds a random book of a given genre and takes the user to amazon for checkout.

# User Interface
## Stack: react, typescript, Vite and tailwind CSS
## How to run:
```
cd public
npm i
npm run dev
```
### How it works:

- The user interface has a form with a Select where the user can select a genre and click the `Find a Book` button.
- For the list of genres an API is called in useEffect of the app component.
- For finding a book I call the second API.

### Some issues:
- Amazon sometimes renders a different UI for example if the user is not logged in(which will be the case most of the time when using puppeteer) after clicking add to cart the next page sometimes does not have Proceed to checkout button.
- If the product is not in stock I have returned an error response `Book not available on Amazon`.