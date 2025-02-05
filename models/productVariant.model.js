const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductVariants = sequelize.define('ProductVariants', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
        code: {
            type: DataTypes.STRING,
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        discount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        specialPrice: {
            type: DataTypes.INTEGER,
        },
        size: {
            type: DataTypes.STRING,
        },
        color: {
            type: DataTypes.STRING,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'productsvariants',
        timestamps: false,
    });

    return ProductVariants;
};
