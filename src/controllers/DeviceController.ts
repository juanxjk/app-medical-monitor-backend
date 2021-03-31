import { Request, Response } from "express";
import DeviceRepository from "../repositories/DeviceRepository";
import Device from "../models/Device";
import { removeNullValues } from "./utils/filters";

const repository = new DeviceRepository();

export default {
  async index(req: Request, res: Response) {
    try {
      const { page, size, deleted } = req.query as {
        [key: string]: string;
      };
      const { relations } = req.query;

      const devices = await repository.findAll({
        page: +page,
        size: +size,
        withDeleted: deleted === "true" ? true : false,
        relations: ["patient"],
        withRelations: relations === "true" ? true : false,
      });

      return res.json(devices);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const foundDevice = await repository.findByID(id, {
        relations: ["patient"],
      });

      return res.json(foundDevice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const rawDevice = removeNullValues(req.body);

      const device = Object.assign(new Device(), rawDevice);

      const createdDevice = await repository.store(device);

      return res.status(201).json(createdDevice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rawDevice = req.body;
      if (!rawDevice) res.json({ error: "Invalid body" });

      const device = Object.assign(new Device(), rawDevice);

      const updatedDevice = await repository.update(id, device);

      res.json(updatedDevice);
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
};
