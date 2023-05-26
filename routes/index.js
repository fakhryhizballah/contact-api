const express = require("express");
const routes = express.Router();

const base = require('../controllers');


const middleware = require('../middlewares');


routes.get('/contact/', base.getContak);
routes.post('/contact/', base.addContak);
routes.get('/contact/batchGetContak/', base.batchGetContak);

module.exports = routes;