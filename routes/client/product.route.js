const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/product.controller");



route.get("/", controller.index);
route.get("/category", controller.category);
route.get("/newProduct", controller.newProduct);
route.get("/category/:id", controller.getProductsByCategory);

route.get("/search", controller.search);
module.exports = route;