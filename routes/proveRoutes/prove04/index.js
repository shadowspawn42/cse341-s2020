const express = require('express');
const router = express.Router();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const shopAuth = require("./routes/auth")

router.use("/admin", adminRoutes)
    .use(shopRoutes)
    .use(shopAuth);

module.exports = router;