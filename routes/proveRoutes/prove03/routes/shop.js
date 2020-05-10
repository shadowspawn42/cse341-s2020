const express = require('express');

const shopController = require('../controller/shop');

const router = express.Router();

router.get("/", shopController.index);
router.get("/:id", shopController.details);

module.exports = router;