import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class WorkoutPlan extends Model {
    static associate(models: any) {
      WorkoutPlan.belongsTo(models.User, { foreignKey: "userId" });
      WorkoutPlan.hasMany(models.WorkoutExercise, { foreignKey: "workoutPlanId" });
    }
  }

  WorkoutPlan.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      coachDescription: { type: DataTypes.TEXT },
      startDate: { type: DataTypes.DATE },
      endDate: { type: DataTypes.DATE },
    },
    { sequelize, modelName: "WorkoutPlan" }
  );

  return WorkoutPlan;
};