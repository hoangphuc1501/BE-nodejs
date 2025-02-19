const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/cart.controller");
const authMiddleware  = require("../../middlewares/authMiddleware");

// route.get("/", authMiddleware.authenticateToken, controller.index);
route.post("/cartPost", authMiddleware.authenticateToken, controller.cartPost);

module.exports = route;