import 'dotenv/config';
import { Sequelize } from 'sequelize';
import process from 'node:process';

const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'prospectador',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_LOGGING = 'false',
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: 'mysql',
  logging: DB_LOGGING === 'true' ? console.log : false,
  define: {
    underscored: true,
    paranoid: false,
  },
  dialectOptions: {
    decimalNumbers: true,
  },
});

export default sequelize;
