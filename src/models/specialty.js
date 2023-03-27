'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Specialty.hasMany(models.Doctor_Infor, { foreignKey: 'specialtyId', as: 'specialtyData' })
        }
    };
    Specialty.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT('long'),
        descriptionMarkdown: DataTypes.TEXT('long'),
        image: DataTypes.TEXT,

    }, {
        sequelize,
        modelName: 'Specialty',
        freezeTableName: true

    });
    return Specialty;
};