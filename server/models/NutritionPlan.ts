import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class NutritionPlan extends Model {
    static associate(models: any) {
      NutritionPlan.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  NutritionPlan.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      caloriesPerDay: { type: DataTypes.INTEGER },
      notes: { type: DataTypes.TEXT },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "NutritionPlan" }
  );

  return NutritionPlan;
};