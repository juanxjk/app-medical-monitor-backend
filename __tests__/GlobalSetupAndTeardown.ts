import App from "../src/App";
import Logger from "../src/utils/Logger";

const app = App.getInstance();

export async function globalSetup() {
  Logger.info("Setting up all tests...");
  await app.setupMiddlewares();
  await app.startDatabase();
}

export async function globalTeardown() {
  Logger.info("Tearing down all tests...");
  await app.dbConnection?.dropDatabase();
  await app.close();
}

export async function resetDatabase(): Promise<void> {
  await app.dbConnection?.dropDatabase();
  await app.dbConnection?.synchronize(true);
  await app.dbConnection?.runMigrations();
}

export function getApp() {
  return app;
}
