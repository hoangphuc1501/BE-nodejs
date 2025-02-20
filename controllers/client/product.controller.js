const { where } = require("sequelize");
const ProductCategories = require("../../models/ProductCategory.model");
const Product = require("../../models/product.model");
const Brands = require("../../models/brand.model");
const ProductVariant = require("../../models/productVariant.model");
const { Op } = require("sequelize");

// danh sách sản phẩm 
module.exports.index = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                deleted: 0,
                status: 1
            },
            attributes: [
                "id",
                "title",
            ],
            include: [
                {
                    model: ProductCategories,
                    as: "productCategories",
                    attributes: [
                        'id',
                        "name"
                    ]
                },
                {
                    model: ProductVariant,
                    as: "productsvariants",
                    attributes: [
                        "id",
                        "price",
                        "image",
                        "specialPrice",
                        "discount"
                    ],
                    required: false,
                },
            ],
        });
        const formattedProducts = products.map((product) => {
            const firstVariant = product.productsvariants.length > 0 ? product.productsvariants[0] : null;

            return {
                id: product.id,
                title: product.title,
                category: product.productCategories?.name || null,
                variant: firstVariant,
            };
        });

        // Xử lý nếu sản phẩm không có biến thể
        // const formattedProducts = products.map((product) => {
        //     let variants = product.productsvariants && product.productsvariants.length > 0 ? product.productsvariants : []; 

        //     return {
        //         id: product.id,
        //         title: product.title,
        //         category: product.productCategories.name,
        //         variants: variants,
        //     };
        // });

        res.json({
            code: "success",
            message: "hiển thị danh sách sản phẩm thành công.",
            data: formattedProducts
        });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
}

// danh mục sản phẩm
module.exports.category = async (req, res) => {
    try {
        const categories = await ProductCategories.findAll({
            where: {
                deleted: 0,
                status: 1,
                parentID: null
            },
            include: [
                {
                    model: ProductCategories,
                    as: "subCategories",
                },
            ], attributes: [
                "id",
                "name",
                "image",
                "description",
                "slug",
                "parentID",
                "position"
            ]
        });

        if (!categories) {
            return res.status(404).json({
                code: "error",
                message: "Danh mục không tồn tại!"
            });
        }
        res.json({
            code: "success",
            message: "Hiển thị danh mục sản phẩm thành công.",
            categories: categories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// danh mục sản phẩm cha
module.exports.categoryParent = async (req, res) => {
    try {
    const categoryParent = await ProductCategories.findAll({
        where: {
            deleted: 0,
            status: 1,
            parentID: null
        },
        attributes: [
            "id",
            "name",
            "image",
            "description",
            "slug",
            "parentID",
            "position"
        ]
    })
    res.json({
        code: "success",
        message: "Hiển thị danh mục sản phẩm thành công.",
        categoryParent
    });
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// lấy sản phẩm mới
module.exports.newProduct = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                deleted: 0,
                status: 1
            },
            attributes: [
                "id",
                "title",
                "createdAt"
            ],
            include: [
                {
                    model: ProductCategories,
                    as: "productCategories",
                    attributes: [
                        'id',
                        "name"
                    ]
                },
                {
                    model: ProductVariant,
                    as: "productsvariants",
                    attributes: [
                        "id",
                        "price",
                        "image",
                        "specialPrice",
                        "discount"
                    ],

                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]]
        });
        const formattedProducts = products.map((product) => {
            const firstVariant = product.productsvariants.length > 0 ? product.productsvariants[0] : null;

            return {
                id: product.id,
                title: product.title,
                category: product.productCategories?.name || null,
                variant: firstVariant,
            };
        });
        res.json({
            code: "success",
            message: "hiển thị danh sách sản phẩm thành công.",
            data: formattedProducts
        });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
}

// lấy sản phẩm theo danh mục
module.exports.getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                code: "error",
                message: "Danh mục không hợp lệ!"
            });
        }
        const subCategories = await ProductCategories.findAll({
            where: { parentId: id },
            attributes: ["id"]
        });
        const categoryIds = subCategories.map(cat => cat.id);
        categoryIds.push(id);

        // Tìm sản phẩm theo danh mục
        const products = await Product.findAll({
            where: {
                categoriesID: { [Op.in]: categoryIds },
                deleted: 0,
                status: 1
            },
            attributes: ["id", "title"],
            include: [
                {
                    model: ProductCategories,
                    as: "productCategories",
                    attributes: ["id", "name"]
                },
                {
                    model: ProductVariant,
                    as: "productsvariants",
                    attributes: ["id", "price", "image", "specialPrice", "discount"],
                    required: false
                }
            ],
            limit: 6
        });

        if (products.length === 0) {
            return res.json({
                code: "success",
                message: "Không có sản phẩm nào trong danh mục này.",
                data: []
            });
        }

        // Định dạng dữ liệu trả về
        const formattedProducts = products.map((product) => {
            const firstVariant = product.productsvariants.length > 0 ? product.productsvariants[0] : null;

            return {
                id: product.id,
                title: product.title,
                category: product.productCategories?.name || null,
                variant: firstVariant
            };
        });

        res.json({
            code: "success",
            message: "Lấy danh sách sản phẩm theo danh mục thành công.",
            data: formattedProducts
        });
    } catch (error) {
        res.status(500).json({ code: "error", message: error.message });
    }
}

// tìm kiếm sản phẩm
module.exports.search = async (req, res) => {
    try {
        const { query } = req.query;
        console.log("Query:", query);

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm.' });
        }

        // Tìm kiếm sản phẩm theo tiêu chí title hoặc description
        const products = await Product.findAll({
            where: {
                deleted: 0,   // Chỉ tìm sản phẩm chưa bị xóa
                status: 1,    // Chỉ tìm sản phẩm có trạng thái 'active'
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { description: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ["id", "title", "createdAt"],  // Chọn các trường cần thiết
            include: [
                {
                    model: ProductCategories,
                    as: "productCategories",
                    attributes: ['id', 'name']  // Thêm thông tin danh mục
                },
                {
                    model: ProductVariant,
                    as: "productsvariants",
                    attributes: ["id", "price", "image", "specialPrice", "discount"],
                    required: false,
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm phù hợp.' });
        }

        // Format lại dữ liệu để trả về
        const formattedProducts = products.map((product) => {
            const firstVariant = product.productsvariants.length > 0 ? product.productsvariants[0] : null;

            return {
                id: product.id,
                title: product.title,
                category: product.productCategories?.name || null,  // Lấy tên danh mục
                variant: firstVariant  // Lấy thông tin của biến thể đầu tiên (nếu có)
            };
        });

        // Trả về kết quả
        return res.status(200).json({
            code: "success",
            message: "Tìm kiếm sản phẩm thành công.",
            data: formattedProducts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã có lỗi xảy ra!' });
    }
};

// Thương hiệu
module.exports.brands = async (req, res) => {
    try {
        const brands = await Brands.findAll({
            where: {
                deleted: 0,
                status: 1
            },
            attributes: [
                "id",
                "name",
                "image",
                "description",
                "slug",
                "position"
            ]
        })
        return res.status(200).json({
            code: "success",
            message: "Tìm kiếm sản phẩm thành công.",
            brands
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách thương hiệu' });
    }

}
