const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { fetchCampaigns, campagins, registerInstance, unregisterInstance, closeInstnace } = require("./redis-fetch");

const PORT = process.env.PORT || 3000;
const FETCH_INTERVAL = process.env.FETCH_INTERVAL || 10000;

const routes = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use("/api", routes);

const init = async () => {
	try {
		await registerInstance();
		await fetchCampaigns();

		setInterval(fetchCampaigns, FETCH_INTERVAL);
	} catch (error) {
		console.log("Error initializing server", error);
	}
};

const exitHandler = async () => {
	await unregisterInstance();
	closeInstnace();
	process.exit();
};

process.on("exit", exitHandler);

// catches ctrl+c event
process.on("SIGINT", exitHandler);

// catches "kill pid"
process.on("SIGUSR1", exitHandler);
process.on("SIGUSR2", exitHandler);

// catches uncaught exceptions
process.on("uncaughtException", (e) => {
	console.log("UncaughtException ", e.stack);
	exitHandler();
});

init();
if (process.env.NODE_ENV !== "test") {
	app.listen(PORT, () => {
		console.log(`Server is listening at ${PORT}`);
	});

}

module.exports = { app };
