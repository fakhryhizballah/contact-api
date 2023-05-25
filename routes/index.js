const express = require("express");
const routes = express.Router();

const base = require('../controllers');


const middleware = require('../middlewares');


routes.get('/contact/', base.getContak);

module.exports = routes;