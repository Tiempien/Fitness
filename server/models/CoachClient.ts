import { Model, DataTypes } from "sequelize";

export default (sequelize: any) => {
  class CoachClients extends Model {
    static associate(models: any) {
      CoachClients.belongsTo(models.User, { foreignKey: "clientId", as: 'client' });
      CoachClients.belongsTo(models.User, { foreignKey: "coachId", as: 'coach' });
    }
  }

  CoachClients.init(
    {
      coachId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CoachClients",
    }
  );

  return CoachClients;
};