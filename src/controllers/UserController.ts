import { Request, Response } from "express";
import User from "../models/User";
import UserRepository from "../repositories/UserRepository";
import { filterFields, removeNullValues } from "./utils/filters";

const repository = new UserRepository();

const UserController = {
  async index(req: Request, res: Response) {
    try {
      const { page, size, deleted, name } = req.query as {
        [key: string]: string;
      };

      const users = await repository.findAll({
        page: +page,
        size: +size,
        where: removeNullValues({ fullName: name }),
        withDeleted: deleted === "true" ? true : false,
      });

      return res.json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const foundUser = await repository.findByID(id);

      return res.json(foundUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const rawUser = removeNullValues(req.body);

      const user = Object.assign(new User(), rawUser);

      const createdUser = await repository.store(user);

      return res.status(201).json(createdUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rawUser = req.body;
      if (!rawUser) res.json({ error: "Invalid body" });

      const user = Object.assign(new User(), rawUser);

      const updatedUser = await repository.update(id, user);

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      repository.delete(id);
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async createGuestUser(req: Request, res: Response) {
    try {
      const body: Partial<User> = req.body;

      const filtered = filterFields(body, [
        "fullName",
        "email",
        "username",
        "password",
      ]);

      req.body = filtered;

      return UserController.create(req, res);
    } catch (err) {
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
};

export default UserController;
