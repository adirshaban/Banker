const router = require("express").Router();
const { campagins, redisClient } = require("../redis-fetch");

router.post("/", (req, res) => {
	const { auction_id, campaign_id, price } = req.body;
	const campaignBudget = campagins[campaign_id];

	console.log("budget", campaignBudget);

	if (!campaignBudget) {
		return res.status(404).json({ message: `campaign ${campaign_id} does not exist` });
	}

	if (price <= campaignBudget) {
		campagins[campaign_id] -= price;
		res.json({ didBid: true });
		redisClient.hmset(`auctions:${auction_id}`, "campaign_id", campaign_id, "price", price);
		return;
	}
	return res.json({ didBid: false });
});

router.post("/lose/:auction_id", (req, res) => {
	const { auction_id } = req.params;
	redisClient.hgetall(`auctions:${auction_id}`, (err, auction) => {
		if (err) {
			console.log("Error while fetching auction", err);
			return res.status(500).json("Error while fetching auction");
		}

		console.log("auction", auction);

		if (!auction) {
			return res.status(404).json({ message: `auction ${auction_id} does not exist` });
		}
        campagins[auction.campaign_id] += +auction.price;
		return res.status(200).json({});
	});
});

module.exports = router;
