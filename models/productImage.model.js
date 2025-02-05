const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");


const ProductImages = sequelize.define('ProductImages', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    productVariantID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageName: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
    },
    deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
    },
}, {
    tableName: 'productimage',
    timestamps: false,
});


module.exports = ProductImages;