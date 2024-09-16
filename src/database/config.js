require('dotenv').config();
//todo: deletar e refazer todas as migrations, assim como criar uma seed padrão para teste
module.exports = {
  development: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT, 10)
  },
  test: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT, 10)
  },
  production: {
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: "postgres",
    port: parseInt(process.env.PG_PORT, 10)
  }
};
