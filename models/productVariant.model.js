const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");
const Products = require("./product.model")

const ProductVariants = sequelize.define('ProductVariants', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0 },
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
    },
    specialPrice: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        defaultValue: null, 
    },
    discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0, max: 100 }, 
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    version: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'productsvariants',
    timestamps: false,
});
Products.hasMany(ProductVariants, { foreignKey: "productID", as: "productsvariants" });
ProductVariants.belongsTo(Products, { foreignKey: "productID", as: "products" });

module.exports = ProductVariants;
