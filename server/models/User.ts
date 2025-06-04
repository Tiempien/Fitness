import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class User extends Model {
    static associate(models: any) {
      User.hasMany(models.WorkoutPlan, { foreignKey: "userId" });
      User.hasMany(models.NutritionPlan, { foreignKey: "userId" });
      User.hasMany(models.Progress, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
      profilePicture: { type: DataTypes.STRING },
      bio: { type: DataTypes.TEXT },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, modelName: "User" }
  );

  return User;
};