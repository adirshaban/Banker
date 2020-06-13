const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;

const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
});