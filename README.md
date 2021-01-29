# Doge Crypto Server

### node server which can be used to monitor Doge Coin [USD]

To get the server running, `clone` the repo, run `npm i`.

This is built to run in the terminal and keep track of changes to Doge Coin in real time.

direct your terminal to the repo file and run the following

`node server.js -PORT_NUMBER -TOTAL_SHARES -PERCENT_DROP -NOTIFY_CURRENT -NOTIFY_EVERY_SECONDS`

- Port Number defaults to 3000
- Total Shares defaults to 0
- Percent Drop defaults to 5
- Notify Current defaults to false
- Notify Every defaults to 5 seconds

### Example Command
`node server.js 5000 1800 3 true 5`

The server will notify you of the following

`$ 0.04724 USD - $ 604.00` - [**Current Highest**] - [**Current Total**]

if Notify Current `True`

`.. $ 0.04724 USD` - [**Current Value**] - **stable**

`++ $ 0.04800 USD` - [**Current Value**] - **higher**

`-- $ 0.03800 USD` - [**Current Value**] - **loss**

when it drops below your current percent drop 

`$ 0.03800 USD, price has dropped 5%` 
