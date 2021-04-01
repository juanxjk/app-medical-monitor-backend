import { Router } from "express";

import { auth } from "./middlewares/auth";

import UserController from "./controllers/UserController";
import SessionController from "./controllers/SessionController";
import DeviceController from "./controllers/DeviceController";
import PatientController from "./controllers/PatientController";

const routes = Router();

// PUBLIC
routes.get("/", (req, res) => {
  res.send({ message: "It works! 🎉" });
});
routes.post("/sessions", SessionController.login);

// AUTHENTICATED

routes.use(auth);

routes.get("/devices", DeviceController.index);
routes.get("/devices/:id", DeviceController.show);
routes.post("/devices", DeviceController.create);
routes.patch("/devices/:id", DeviceController.update);
routes.delete("/devices/:id", DeviceController.delete);

routes.get("/patients", PatientController.index);
routes.get("/patients/:id", PatientController.show);
routes.post("/patients", PatientController.create);
routes.patch("/patients/:id", PatientController.update);
routes.delete("/patients/:id", PatientController.delete);

routes.get("/users", UserController.index);
routes.get("/users/:id", UserController.show);
routes.post("/users", UserController.create);
routes.patch("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.delete);

export default routes;
