import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class Onboarding extends Model {
    static associate(models: any) {
      Onboarding.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Onboarding.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
      fitnessGoals: { type: DataTypes.TEXT },
      height: { type: DataTypes.FLOAT },
      weight: { type: DataTypes.FLOAT },
      medicalConditions: { type: DataTypes.TEXT },
      experienceLevel: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "Onboarding" }
  );

  return Onboarding;
}; 