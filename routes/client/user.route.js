const express = require("express");
const route = express.Router();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const controller = require("../../controllers/client/user.controller");
const authMiddleware  = require("../../middlewares/authMiddleware");
const delayMiddleware = require("../../middlewares/delay.middleware");

// route.use(delayMiddleware.delay);

route.post("/register", controller.register);
route.post("/login", controller.login);
// route.post("/logout", controller.logout);
route.post("/password/forgot", controller.forgotPassword);
route.post("/password/otp", controller.otpPassword);
route.post("/password/change", authMiddleware.authenticateToken ,controller.changePassword);
route.get("/profile", authMiddleware.authenticateToken ,controller.profile);
route.patch("/updateProfile", authMiddleware.authenticateToken,controller.updateProfile);
// route.get("/account", authMiddleware.authenticateToken ,controller.getAccount);
module.exports = route;