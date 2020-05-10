const express = require('express');
const router = express.Router();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

router.use("/admin", adminRoutes)
    .use(shopRoutes);

module.exports = router;