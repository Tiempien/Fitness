import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class Exercise extends Model {
    static associate(models: any) {
    }
  }

  Exercise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      instructionalVideoUrl: { type: DataTypes.STRING },
      category: { type: DataTypes.STRING, allowNull: false },
      difficulty: { type: DataTypes.STRING, allowNull: false },
    },
    { sequelize, modelName: "Exercise" }
  );

  return Exercise;
};
