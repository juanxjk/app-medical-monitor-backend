import * as typeorm from "typeorm";
import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { json } from "body-parser";

import config from "./config";
import dbConfig from "./config/ormconfig";

import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler/errorHandler";

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
    console.log("Server is starting...");

    try {
      await this.startHttpServer();
      await this.setupMiddlewares();
      await this.startDatabase();
    } catch (err) {
      console.error(err);
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
          console.log("Server running on port:", config.port)
        );
    } catch (err) {
      console.error(err);
    }
  }

  async startDatabase() {
    try {
      if (!this.dbConnection) {
        this.dbConnection = await typeorm.createConnection(dbConfig);
        console.log("Database is connected.");

        console.log(`Database name: ${this.dbConnection.options.database}.`);

        console.log(
          `Database Sync mode: ${this.dbConnection.options.synchronize}.`
        );
      }
    } catch (err) {
      console.error("App: database connection error.");
      console.error(err);
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
