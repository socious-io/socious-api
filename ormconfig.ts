/* TypeORM configuration for database inspection and creating/running migrations
 */

import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 33060),
  username: "admin",
  password: "secret",
  database: "socious",
  entities: ["src/**/Models/*{.ts,.js}"],
  migrations: ["migrations/*.{ts,js}"],
  migrationsTableName: "typeorm_migrations",
});
