const router = require("express").Router();
const bidRouter = require('./bid');

router.use('/bid', bidRouter);

module.exports = router;