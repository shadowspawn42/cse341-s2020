const express = require("express");
const routes = express.Router();


const prove02 = require('./prove02'); 
const prove03 = require('./prove03'); 


routes
    .use('/prove02', prove02)
    .use('/prove03', prove03);


module.exports = routes;