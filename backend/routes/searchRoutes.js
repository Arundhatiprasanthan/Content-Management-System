const express = require("express");
const router = express.Router();
const { searchAll } = require("../controllers/searchController");

// Public Search Endpoint
router.get("/", searchAll);

module.exports = router;
