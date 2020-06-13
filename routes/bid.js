const router = require("express").Router();

router.post("/", (req, res) => {
    /* body should be auction_id , campaign_id, price
    check if price < on memory campaign budget if so return true else false
     */
});

router.post("/lose", (req, res) => {
    /*
        adds to on memory campaign budget, takes price from redis
     */
});

module.exports = router;

