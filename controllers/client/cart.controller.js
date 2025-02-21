const User = require("../../models/user.model");
const Products = require("../../models/product.model");
const Carts = require("../../models/cart.model");
const ProductVariants = require("../../models/productVariant.model");

// thêm sãn phẩm vào cart
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
        let cartItem = await Carts.findOne({
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

// show giỏ hàng
module.exports.index = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                code: "error",
                message: "Người dùng chưa đăng nhập!"
            });
        }

        // Truy vấn giỏ hàng của người dùng
        const cartItems = await Carts.findAll({
            where: { userId },
            include: [
                {
                    model: ProductVariants,
                    as: "ProductVariant",
                    attributes: ["id", "price", "size", "color", "stock"],
                    include: [
                        {
                            model: Products,
                            as: "product",
                            attributes: ["title", "slug"]
                        }
                    ]
                }
            ]
        });

        if (!cartItems.length) {
            return res.status(200).json({
                code: "success",
                message: "Giỏ hàng trống.",
                cart: []
            });
        }
        // Xử lý dữ liệu để trả về định dạng mong muốn
        const formattedCart = cartItems.map(item => ({

            id: item.id,
            product: item.ProductVariant.product.title,
            slug: item.ProductVariant.product.slug,
            variant: {
                id: item.ProductVariant.id,
                color: item.ProductVariant.color,
                size: item.ProductVariant.size,
                price: item.ProductVariant.price
            },
            quantity: item.quantity,
            totalPrice: item.quantity * item.ProductVariant.price
        }));

        return res.status(200).json({
            code: "success",
            message: "Hiển thị giỏ hàng thành công.",
            cart: formattedCart
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server, vui lòng thử lại." });
    }
}

// xóa sản phẩm ra khỏi giỏ hàng
module.exports.cartDelete = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const { cartItems } = req.params; 
        console.log("Request Params:", req.params);

        if (!userId) {
            return res.status(401).json({
                code: "error",
                message: "Người dùng chưa đăng nhập!"
            });
        }

        // Kiểm tra sản phẩm trong giỏ hàng có tồn tại không
        const cartItem = await Carts.findOne({
            where: { id: cartItems, userId }
        });

        if (!cartItem) {
            return res.status(404).json({
                code: "error",
                message: "Sản phẩm trong giỏ hàng không tồn tại!"
            });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        await cartItem.destroy();

        return res.status(200).json({
            code: "success",
            message: "Sản phẩm đã được xóa khỏi giỏ hàng."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Lỗi server, vui lòng thử lại." });
    }
}

// xóa nhìu 
// module.exports.cartDeleteMany = async (req, res) => {
//     try {
//         const userId = req.user.userId;
//         const { cartItems } = req.body;

//         console.log("Cart Items to delete:", cartItems);

//         if (!userId) {
//             return res.status(401).json({
//                 code: "error",
//                 message: "Người dùng chưa đăng nhập!"
//             });
//         }

//         if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
//             return res.status(400).json({
//                 code: "error",
//                 message: "Danh sách sản phẩm cần xóa không hợp lệ!"
//             });
//         }

//         // Xóa tất cả sản phẩm trong danh sách cartItems
//         await Carts.destroy({
//             where: {
//                 id: cartItems,
//                 userId: userId
//             }
//         });

//         return res.status(200).json({
//             code: "success",
//             message: "Sản phẩm đã được xóa khỏi giỏ hàng."
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Lỗi server, vui lòng thử lại." });
//     }
// };