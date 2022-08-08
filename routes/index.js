const ApiController = require("../controllers/api");
const express = require("express");
const router = express.Router();

router.post("/api/shorturl", ApiController.postUrl);
router.get("/api/shorturl/:url", ApiController.redirectSite);
module.exports = router;