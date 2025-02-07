const newsRoute = require("./news.route");
const userRoute = require("./user.route");
const contactRoute = require("./contact.route");
module.exports = (app) => {

    // app.use("/", homeRoute);
    // app.use("/products", productsRoute);
    // app.use("/cart", cartRoute);
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


