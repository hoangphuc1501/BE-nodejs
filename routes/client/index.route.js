const userRoute = require("./user.route");

module.exports = (app) => {

    // app.use("/", homeRoute);
    // app.use("/products", productsRoute);
    // app.use("/cart", cartRoute);
    // app.use("/order", orderRoute);
    app.use("/user", userRoute);
    // app.use("/contact", contactRoute);
    // app.use("/news", newsRoute);
    // app.get("*", (req, res) => {
    //     res.render("client/pages/errors/404", {
    //         pageTitle: "404 Not Found",
    //     });
    // });
};


