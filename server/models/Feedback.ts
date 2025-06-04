import { Model, DataTypes } from 'sequelize';

export enum FeedbackType {
  PROGRAM = 'PROGRAM',
  COACH = 'COACH',
  CONVERSATION = 'CONVERSATION'
}

export default (sequelize: any) => {
  class Feedback extends Model {
    static associate(models: any) {
      Feedback.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Feedback.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(FeedbackType)),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Feedback',
      tableName: 'feedbacks',
    }
  );

  return Feedback;
}; 