import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { json } from "body-parser";
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
        this.expressServer = this.expressApp.listen(3000, () =>
          console.log("Server running on port:", 3000)
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
