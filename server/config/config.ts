import dotenv from 'dotenv';
dotenv.config();

interface DbConfig {
  username: string | undefined;
  password: string | undefined;
  database: string | undefined;
  host: string | undefined;
  dialect: string;
  seederStorageTableName: string;
}

interface Config {
  development: DbConfig;
  test?: DbConfig;
  production?: DbConfig;
}

const config: Config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mariadb",
    seederStorageTableName: "sequelize_seed"
  }
};

export default config; 