const express = require("express");
// const mongoose = require('mongoose');
const routes = express.Router();

const base = require('../controllers');


const middleware = require('../middlewares');


routes.get('/contact/', base.getContak);
routes.post('/contact/', base.addContak);
routes.get('/contact/batchGetContak/', base.batchGetContak);
routes.get('/contact/refreshAccessToken', base.refreshAccessToken);

module.exports = routes;