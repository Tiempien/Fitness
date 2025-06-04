import { Model, DataTypes } from 'sequelize';

export enum CoachingCallStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export default (sequelize: any) => {
  class CoachingCall extends Model {
    static associate(models: any) {
      CoachingCall.belongsTo(models.User, { foreignKey: "clientId", as: 'client' });
      CoachingCall.belongsTo(models.User, { foreignKey: "coachId", as: 'coach' });
    }
  }

  CoachingCall.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      coachId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duration in minutes',
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CoachingCallStatus)),
        allowNull: false,
        defaultValue: CoachingCallStatus.PENDING,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'CoachingCall',
      tableName: 'coaching_calls',
    }
  );

  return CoachingCall;
}; 