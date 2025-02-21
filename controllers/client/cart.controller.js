const User = require("../../models/user.model");
const Products = require("../../models/product.model");
const Carts = require("../../models/cart.model");
const ProductVariants = require("../../models/productVariant.model");

module.exports.cartPost = async (req, res) => {
    try {
        const { productsvariantId, quantity } = req.body;

        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({
                code: "error",
                message: "Người dùng chưa đăng nhập!"
            });
        }

        // Kiểm tra biến thể sản phẩm có tồn tại không
        const productVariant = await ProductVariants.findOne({
            where: { id: productsvariantId },
            include: [
                {
                    model: Products,
                    as: "product",
                    attributes: ["title", "slug"]
                }
            ]
        });
        if (!productVariant) {
            return res.status(404).json({
                code: "error",
                message: "Biến thể sản phẩm không tồn tại!"
            });
        }
        
        // Kiểm tra số lượng tồn kho
        if (quantity > productVariant.stock) {
            return res.status(404).json({
                code: "error",
                message: "Trong kho không đủ số lượng!"
            });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let  cartItem = await Carts.findOne({
            where: { userId, productsvariantId }
        });
        if (cartItem) {
            // Nếu đã có, cập nhật số lượng mới
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > productVariant.stock) {
                return res.status(404).json({
                    code: "error",
                    message: `Vượt quá số lượng tồn kho! Chỉ còn ${productVariant.stock} sản phẩm.`
                });
            }

            await cartItem.update({ quantity: newQuantity });
            return res.status(200).json({
                code: "success",
                message: "Cập nhật số lượng sản phẩm trong giỏ hàng thành công.",
                cartItem: {
                    id: cartItem.id,
                    product: productVariant.product.title,
                    slug: productVariant.product.slug,
                    variant: {
                        id: productVariant.id,
                        color: productVariant.color,
                        size: productVariant.size,
                        price: productVariant.price
                    },
                    quantity: newQuantity
                }
            });
        } else {
            // Nếu chưa có, thêm mới vào giỏ hàng
            cartItem = await Carts.create({
                userId,
                productsvariantId,
                quantity
            });

            return res.status(200).json({
                code: "success",
                message: "Sản phẩm đã được thêm vào giỏ hàng.",
                cartItem: {
                    id: cartItem.id,
                    product: productVariant.product.title,
                    slug: productVariant.product.slug,
                    variant: {
                        id: productVariant.id,
                        color: productVariant.color,
                        size: productVariant.size,
                        price: productVariant.price
                    },
                    quantity
                }
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server, vui lòng thử lại." });
    }

}