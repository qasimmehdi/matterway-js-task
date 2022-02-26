const config = {
  GOOD_READ_URL: "https://www.goodreads.com",
  PUPPETEER_OPTIONS: {
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--start-fullscreen"],
  },
  USER_AGAENT:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
};

export default config;
