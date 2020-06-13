const redis = require("redis");
const Redlock = require("redlock");

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
// 24 * 60 * 60
const TOTAL_SECONDS = 86400;

let campagins = {};

const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);
const redlock = new Redlock([redisClient]);

redlock.on("clientError", (clientError) => {
	console.log("A redis error occurred: ", clientError);
});

const fetchCampaigns = async () => {
	try {
		const lock = await redlock.lock("locks:campaigns", 2000);

		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		const secondsUntilEndOfDate = TOTAL_SECONDS - (hours * 60 * 60 + minutes * 60 + seconds);

		let bankersCounter;
		redisClient.get("instances", (err, counter) => {
			if (err) {
				console.log("Error fetching instances counter", err);
				return;
			}
			bankersCounter = counter;
		});

		redisClient.keys("campaigns*", (err, keys) => {
			if (err) {
				console.log("Error fetching campaigns from redis", err);
				return;
			}

			for (const key of keys) {
				// campaigns:1 >> 1
				const keyId = key.split(":")[1];

				redisClient.get(key, (err, budget) => {
					if (err) {
						console.log(`Error fetching key ${key}`, err);
						return;
					}

					// calculates relative campaign budget
					const campaignBudget = +budget / ((TOTAL_SECONDS * bankersCounter) / secondsUntilEndOfDate);

					// calculate the amount of money instance should take from redis
					const diff = campagins[keyId] ? campaignBudget - campagins[keyId] : campaignBudget;
					if (diff > 0) {
						campagins[keyId] = campaignBudget;
						const newBudget = +budget - diff;
						console.log(`   ${key} was ${budget} now -> ${newBudget} `);
						redisClient.set(key, newBudget);
					}
				});
			}
		});

		lock.unlock();
	} catch (error) {
		console.log("Error occurred while fetching campaigns", error);
	}
};

module.exports = { campagins, redisClient, fetchCampaigns };
