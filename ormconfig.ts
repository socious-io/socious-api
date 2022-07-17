/* TypeORM configuration for database inspection and creating/running migrations
 */

import { DataSource } from "typeorm";

export const connectionSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 33060,
  username: "admin",
  password: "secret",
  database: "socious",
  entities: [
    "libs/**/*.model.{ts,js}",
    // "libs/**/Models/*{.ts,.js}",
  ],
  migrations: ["migrations/*.{ts,js}"],
  migrationsTableName: "typeorm_migrations",
});
