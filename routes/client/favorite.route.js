const express = require("express");
const route = express.Router();

const controller = require("../../controllers/client/favorite.controller");



route.get("/", controller.index);
route.post("/favoritePost", controller.favoritePost);
route.delete("/delete", controller.favoriteDelete);



module.exports = route;