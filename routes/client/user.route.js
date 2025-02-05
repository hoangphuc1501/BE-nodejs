const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/user.controller");
const authMiddleware  = require("../../middlewares/authMiddleware");

route.post("/register", controller.register);
route.post("/login", controller.login);
// route.post("/logout", controller.logout);
route.post("/password/forgot", controller.forgotPassword);
route.post("/password/otp", controller.otpPassword);
route.post("/password/change", authMiddleware .authenticateToken ,controller.changePassword);
module.exports = route;