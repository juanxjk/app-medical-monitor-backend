import { Router } from "express";

import { auth } from "./middlewares/auth";

const routes = Router();

// PUBLIC
routes.get("/", (req, res) => {
  res.send({ message: "It works! 🎉" });
});
routes.post("/sessions", SessionController.login);

// AUTHENTICATED

routes.use(auth);

export default routes;
