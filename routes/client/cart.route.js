const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/cart.controller");
const authMiddleware  = require("../../middlewares/authMiddleware");

route.get("/", authMiddleware.authenticateToken, controller.index);
route.post("/cartPost", authMiddleware.authenticateToken, controller.cartPost);
route.delete("/delete/:cartItems", authMiddleware.authenticateToken, controller.cartDelete);
// route.delete("/deleteMany", authMiddleware.authenticateToken, controller.cartDeleteMany);
module.exports = route;