const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const app = express();
const argv = process.argv.slice(2);
const PORT = argv[0] || 3000;
const total = argv[1] || 0;
const percentDropped = argv[2] || 5;
let notifyCurrent = false;
const notifyEvery = argv[4] || 5;

if (argv[3] === "true") {
  notifyCurrent = true;
}

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
  let previousHigh = null;
  let previous_check = null;
  setInterval(() => {
    axios(URL)
      .then((response) => {
        const html = response.data; // get HTML
        const $ = cheerio.load(html); // parse HTML
        const price = $(selector); // get price as string
        let float = price.text().split("$")[1]; // get only numbers
        let num = parseFloat(float); // stroe as float

        if (!first) {
          first = num;
          previous = first;
          previousHigh = first;
          console.log(`Opening check, $ ${num} USD - $ ${num * total} USD`);
        } else {
          switch (notifyCurrent) {
            case true:
              if (num > previous) {
                console.log(` ++ $ ${num} USD - $ ${num * total} USD`);
                previous = num;
                return;
              } else if (num === previous) {
                console.log(`.. $ ${num} USD - $ ${num * total} USD`);
                return;
              } else if (num < previous) {
                console.log(`-- $ ${num} USD - $ ${num * total} USD`);
                return;
              }
              break;
            case false:
              if (num > previous) {
                console.log(` ++ $ ${num} USD - $ ${num * total} USD`);
                previous = num;
                return;
              }
              break;
          }

          let five_less = (percentDropped / 100) * previous;
          let check_value = previous - five_less;

          if (num < check_value && check_value !== previous_check) {
            previous_check = check_value;
            console.log(
              ` $ ${price.text()} USD, price has dropped ${percentDropped}%`
            );
          }
        }
        previous = num;
      })
      .catch(console.error);
  }, notifyEvery * 1000);
});
