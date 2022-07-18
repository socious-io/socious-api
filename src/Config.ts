import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 8370),
  auth: {
    secret: process.env.AUTH_SECRET ?? "EDlguXthn9Tbg2G7I9IoBbrKvNVe4dUQ75P1j2nx",
  },
  mysql: {
    host: process.env.MYSQL_HOST ?? "localhost",
    port: Number(process.env.MYSQL_PORT ?? 33060),
    username: process.env.MYSQL_USERNAME ?? "admin",
    password: process.env.MYSQL_PASSWORD ?? "secret",
    database: process.env.MYSQL_DATABASE ?? "socious",
  },
};
