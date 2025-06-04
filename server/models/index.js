import { Sequelize } from "sequelize";
import UserModel from "./User";
import NutritionPlanModel from "./NutritionPlan";
import ProgressModel from "./Progress";
import ExerciseModel from "./Exercise";
import WorkoutExerciseModel from "./WorkoutExercise";
import WorkoutPlanModel from "./WorkoutPlan";
import CoachClientModel from "./CoachClient";
import OnboardingModel from "./Onboarding";
import CoachingCallModel from "./CoachingCall";
import FeedbackModel from "./Feedback";

const config = useRuntimeConfig();

// Initialize Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging || false,
});

// Initialiseer modellen
const models = {
  User: UserModel(sequelize),
  NutritionPlan: NutritionPlanModel(sequelize),
  Progress: ProgressModel(sequelize),
  Exercise: ExerciseModel(sequelize),
  WorkoutExercise: WorkoutExerciseModel(sequelize),
  WorkoutPlan: WorkoutPlanModel(sequelize),
  CoachClient: CoachClientModel(sequelize),
  Onboarding: OnboardingModel(sequelize),
  CoachingCall: CoachingCallModel(sequelize),
  Feedback: FeedbackModel(sequelize),
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export const {
  User,
  NutritionPlan,
  Progress,
  Exercise,
  WorkoutExercise,
  WorkoutPlan,
  CoachClient,
  Onboarding,
  CoachingCall,
  Feedback,
} = models;

export { sequelize };