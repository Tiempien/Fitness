import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    logging: false,
  }
);

export default sequelize;
