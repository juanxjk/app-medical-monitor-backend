import "./";
import { ConnectionOptions } from "typeorm";

const config: ConnectionOptions = {
  type: "postgres",
  url: process.env.DB_URL,
  host: process.env.DB_HOST || "localhost",
  port: 5432,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "root",
  database: process.env.DB_DATABASE || "app_medical_dev",
  synchronize: process.env.DB_SYNC === "true" || false,
  logging: process.env.DB_LOGGING === "true" || false,
  migrations: ["./src/database/migrations/*.ts"],
  entities: ["./src/models/*.ts"],
  cli: {
    entitiesDir: "entity",
    migrationsDir: "./src/database/migrations",
    subscribersDir: "subscriber",
  },
};

export default config;
