const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ProductCategories = sequelize.define('ProductCategories', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.TEXT,
        },
        parentID: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1,
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        slug: {
            type: DataTypes.STRING,
        },
        createAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updateAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deleteAt: {
            type: DataTypes.DATE,
        },
    }, {
        tableName: 'productcategories',
        timestamps: false,
    });

    return ProductCategories;
};
