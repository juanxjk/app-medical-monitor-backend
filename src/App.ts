import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { json } from "body-parser";

import config from "./config";
import routes from "./routes";

class App {
  public expressApp: Express = express();
  public expressServer?: Server;

  async start() {
    console.log("Server is starting...");

    try {
      await this.startHttpServer();
      await this.setupMiddlewares();
    } catch (err) {
      console.error(err);
    }
  }

  async close() {
    this.closeHttpServer();
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

  async setupMiddlewares() {
    this.expressApp.use(cors());
    this.expressApp.use(json());
    this.expressApp.use(routes);
  }

  closeHttpServer() {
    if (this.expressServer) this.expressServer.close();
  }
}

export default new App();
