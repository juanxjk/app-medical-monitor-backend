import * as typeorm from "typeorm";
import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { json } from "body-parser";

import config from "./config";
import dbConfig from "./config/ormconfig";

import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler/errorHandler";
import Logger from "./utils/Logger";

let instance: App;

export class App {
  public expressApp: Express = express();
  public expressServer?: Server;
  public dbConnection?: typeorm.Connection;

  static getInstance(): App {
    if (!instance) instance = new App();
    return instance;
  }

  async start() {
    Logger.info("Server is starting...");

    try {
      await this.startHttpServer();
      await this.setupMiddlewares();
      await this.startDatabase();
    } catch (err) {
      Logger.error(err);
    }
  }

  async close() {
    this.closeHttpServer();
    this.closeDatabase();
  }

  async startHttpServer() {
    try {
      if (!this.expressServer || !this.expressServer.listening)
        this.expressServer = this.expressApp.listen(config.port, () =>
          Logger.info("Server running on port: " + config.port)
        );
    } catch (err) {
      Logger.error(err);
    }
  }

  async startDatabase() {
    try {
      if (!this.dbConnection) {
        this.dbConnection = await typeorm.createConnection(dbConfig);
        Logger.info("Database is connected.");

        Logger.debug(`Database name: ${this.dbConnection.options.database}.`);

        Logger.debug(
          `Database Sync mode: ${this.dbConnection.options.synchronize}.`
        );
      }
    } catch (err) {
      Logger.error("App: database connection error.");
      Logger.error(err);
    }
  }

  async setupMiddlewares() {
    this.expressApp.use(cors());
    this.expressApp.use(json());
    this.expressApp.use(routes);
    this.expressApp.use(errorHandler);
  }

  closeDatabase() {
    this.dbConnection?.close();
  }

  closeHttpServer() {
    if (this.expressServer) this.expressServer.close();
  }
}

export default App;
