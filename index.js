const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { fetchCampaigns, campagins } = require("./redis-fetch");

const PORT = process.env.PORT || 3000;
const FETCH_INTERVAL = process.env.FETCH_INTERVAL || 10000;

const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use("/api", routes);

fetchCampaigns();
setInterval(fetchCampaigns, FETCH_INTERVAL);

app.listen(PORT, () => {
	console.log(`Server is listening at ${PORT}`);
});
