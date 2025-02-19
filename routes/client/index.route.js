const newsRoute = require("./news.route");
const userRoute = require("./user.route");
const contactRoute = require("./contact.route");
const productsRoute = require("./product.route");
const cartRoute = require("./cart.route");
const favoriteRoute = require("./favorite.route");

const authMiddleware  = require("../../middlewares/authMiddleware");

module.exports = (app) => {

    // app.use("/", homeRoute);
    
    app.use("/products", productsRoute);
    app.use("/carts", cartRoute);
    app.use("/favorite", authMiddleware.authenticateToken , favoriteRoute);
    // app.use("/order", orderRoute);
    app.use("/contact", contactRoute);
    app.use("/news", newsRoute);
    app.use("/user", userRoute);
    // app.get("*", (req, res) => {
    //     res.render("client/pages/errors/404", {
    //         pageTitle: "404 Not Found",
    //     });
    // });
};


