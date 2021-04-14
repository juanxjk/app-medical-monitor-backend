import { Request, Response } from "express";
import PatientRepository from "../repositories/PatientRepository";
import Patient from "../models/Patient";
import { removeNullValues } from "./utils/filters";

const repository = new PatientRepository();

export default {
  async index(req: Request, res: Response) {
    try {
      const { page, size, deleted, name } = req.query as {
        [key: string]: string;
      };

      const patients = await repository.findAll({
        page: +page,
        size: +size,
        where: removeNullValues({ fullName: name }),
        withDeleted: deleted === "true" ? true : false,
      });

      return res.json(patients);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const foundPatient = await repository.findByID(id);

      return res.json(foundPatient);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const rawPatient = removeNullValues(req.body);

      const patient = Object.assign(new Patient(), rawPatient);

      const createdPatient = await repository.store(patient);

      return res.status(201).json(createdPatient);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Error 500" });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rawPatient = req.body;
      if (!rawPatient) res.json({ error: "Invalid body" });

      const patient = Object.assign(new Patient(), rawPatient);

      const updatedPatient = await repository.update(id, patient);

      res.json(updatedPatient);
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
