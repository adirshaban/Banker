# Banker
banker service

# Installation

````bash
$ npm install 
````

# Enviroment
you can use `.env.example` to see the variables you should have

if you want to stay with default just run
````bash
$ mv .env.examle .env
````

# Redis prerequesties
Redis shuold have the following keys:
 - `campaigns:'campaign_id'` - each campaign has value of its budget
 - `auctions:'auction_id'` - each auction has hash value of campaign_id and price
 - `instances` - the amount of instances running (this value changes when services runnnign up or shutting down)

 # API

 - POST `/api/bid`
    *  `auction_id` - the id of the auction
    *  `campaign_id` - the id of the campaign
    *  `price` - the price of the bid

    returned body:
    - `didBid` - boolean

- POST `/api/bid/lose/:auction_id`
    
    once you lose the money return to the budget
