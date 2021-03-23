import { Router } from "express";
const routes = Router();

// PUBLIC
routes.get("/", (req, res) => {
  res.send({ message: "It works! 🎉" });
});

export default routes;
