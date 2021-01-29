const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const app = express();
const argv = process.argv.slice(2);
const PORT = argv[0];
const total = argv[1] || 0;

console.log(process.argv);

const URL = "https://www.coindesk.com/price/dogecoin";
const selector =
  "#export-chart-element > div > section > div.coin-info-list.price-list > div:nth-child(1) > div.data-definition > div";

app.get("/", (req, res) => {
  res.send("welcome to dodgecoin checker, results logged to console");
});

app.listen(PORT, () => {
  console.log(`Doge Server Listening on port ${PORT}`);
  let first = null;
  let previous = null;
  let previous_check = null;
  setInterval(() => {
    axios(URL)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const price = $(selector);
        let float = price.text().split("$")[1];
        let num = parseFloat(float);
        if (!first) {
          first = num;
          previous = first;
          console.log(`$ ${num} USD - $ ${num * total}`);
        } else {
          if (num > previous) {
            console.log(` ++ $ ${num} USD - $ ${num * total}`);
            previous = num;
          } else if (num === previous) {
            console.log(` .. $ ${num} USD`);
          } else if (num < previous) {
            console.log(` -- $ ${num} USD`);
          }
        }
        let five_less = (5 / 100) * previous;
        let check_value = previous - five_less;
        if (num < check_value && check_value !== previous_check) {
          previous_check = check_value;
          console.log(`${price.text()} USD, Its dropped 5%`);
        }
        // previous = float;
      })
      .catch(console.error);
  }, 5000);
});
