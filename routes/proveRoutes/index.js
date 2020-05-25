const express = require("express");
const routes = express.Router();


const prove02 = require('./prove02'); 
const prove03 = require('./prove03'); 
const prove04 = require('./prove04'); 
// const prove05 = require('./prove05'); 



routes
    .use('/prove02', prove02)
    .use('/prove03', prove03)
    .use('/prove04', prove04);


module.exports = routes;