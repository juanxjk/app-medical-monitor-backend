import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import UserRepository from "../repositories/UserRepository";
import { filterFields, removeNullValues } from "./utils/filters";

const repository = new UserRepository();

const UserController = {
  async index(req: Request, res: Response, next: NextFunction) {
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
      next(err);
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const foundUser = await repository.findByID(id);

      return res.json(foundUser);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const rawUser = removeNullValues(req.body);

      const user = Object.assign(new User(), rawUser);

      const createdUser = await repository.store(user);

      return res.status(201).json(createdUser);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const rawUser = req.body;
      if (!rawUser) res.json({ error: "Invalid body" });

      const user = Object.assign(new User(), rawUser);

      const updatedUser = await repository.update(id, user);

      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      repository.delete(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async createGuestUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body: Partial<User> = req.body;

      const filtered = filterFields(body, [
        "fullName",
        "email",
        "username",
        "password",
      ]);

      req.body = filtered;

      return UserController.create(req, res, next);
    } catch (err) {
      next(err);
    }
  },
};

export default UserController;
