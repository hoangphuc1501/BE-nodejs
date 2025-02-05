const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Products = sequelize.define('Products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        brand: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
        featured: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        favorite: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        deleted: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        slug: {
            type: DataTypes.STRING,
        },
        codeProduct: {
            type: DataTypes.STRING,
        },
        categoriesID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
        descriptionPromotion: {
            type: DataTypes.TEXT,
        },
    }, {
        tableName: 'products',
        timestamps: true,
    });

    return Products;
};