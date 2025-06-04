import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class WorkoutExercise extends Model {
    static associate(models: any) {
      WorkoutExercise.belongsTo(models.WorkoutPlan, { foreignKey: "workoutPlanId" });
      WorkoutExercise.belongsTo(models.Exercise, { foreignKey: "exerciseId" });
    }
  }

  WorkoutExercise.init(
    {
      workoutPlanId: { type: DataTypes.INTEGER, allowNull: false },
      exerciseId: { type: DataTypes.INTEGER, allowNull: false },
      reps: { type: DataTypes.INTEGER },
      sets: { type: DataTypes.INTEGER },
      restSeconds: { type: DataTypes.INTEGER },
      notes: { type: DataTypes.TEXT },
      order: { type: DataTypes.INTEGER }
    },
    { sequelize, modelName: "WorkoutExercise" }
  );

  return WorkoutExercise;
};