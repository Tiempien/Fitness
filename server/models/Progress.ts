import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class Progress extends Model {
    static associate(models: any) {
      Progress.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Progress.init(
    {
      weight: { type: DataTypes.FLOAT },
      bodyFat: { type: DataTypes.FLOAT },
      notes: { type: DataTypes.TEXT },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "Progress" }
  );

  return Progress;
};