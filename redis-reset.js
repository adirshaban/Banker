const redis = require("redis");
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);

// flushes db
redisClient.flushall();

// sets instances to 1
redisClient.set("instances", 1);

// init campaigns
redisClient.set("campaigns:1", 1000);
redisClient.set("campaigns:2", 10000);
redisClient.set("campaigns:3", 5000);
redisClient.set("campaigns:4", 3000);

// add some auction
redisClient.hmset("auctions:1", "campaign_id", 1, "price", 300);
redisClient.hmset("auctions:2", "campaign_id", 2, "price", 4);
redisClient.hmset("auctions:3", "campaign_id", 3, "price", 50);


redisClient.quit();