const express = require('express');
const router = express.Router();

const ta05 = require("./controller/ta05");


router.post("/reset-session", ta05.resetSession);
router.post("/style", ta05.postStyle);
router.post('/counter', ta05.postCounter);
router.get("/", ta05.getIndex);

module.exports = router;