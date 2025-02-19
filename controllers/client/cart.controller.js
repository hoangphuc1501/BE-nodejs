const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Carts = require("../../models/cart.model");
const ProductVariants = require("../../models/productVariant.model");

module.exports.cartPost = async (req, res) => {
    try {
        const { productsVariantID, quantity } = req.body;
        const userId = req.user.userId; 
        console.log(userId)
        // Kiểm tra biến thể sản phẩm có tồn tại không
        const productVariant = await ProductVariants.findByPk(productsVariantID);
        if (!productVariant) {
            return res.status(404).json({
                code: "error",
                message: "Biến thể sản phẩm không tồn tại!"
            });
        }
        if (!userId) {
            return res.status(401).json({ 
                code: "error",
                message: "Người dùng chưa đăng nhập!" });
        }
        // Kiểm tra số lượng tồn kho
        if (quantity > productVariant.stock) {
            return res.status(404).json({
                code: "error",
                message: "Trong kho không đủ số lượng!"
            });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const cartItem = await Carts.findOne({
            where: { userId, productsVariantID }
        });

        if (cartItem) {
            // Nếu đã có, cập nhật số lượng mới
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > productVariant.stock) {
                return res.status(404).json({
                    code: "error",
                    message: "Vượt quá số lượng trong kho!"
                });
            }

            await cartItem.update({ quantity: newQuantity });
            return res.status(200).json({
                code: "success",
                message: "Số lượng sản phẩm trong giỏ hàng đã được cập nhật."
            });
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            await Carts.create({
                userId,
                productsVariantID,
                quantity
            });
            return res.status(200).json({
                code: "success",
                message: "Sản phẩm đã được thêm vào giỏ hàng."
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server, vui lòng thử lại." });
    }

}