import { NextFunction, Request, Response } from "express";
import PatientRepository from "../repositories/PatientRepository";
import Patient from "../models/Patient";
import { removeNullValues } from "./utils/filters";

const repository = new PatientRepository();

const PatientController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, size, deleted, name } = req.query as {
        [key: string]: string;
      };

      const patients = await repository.findAll({
        page: +page,
        size: +size,
        where: removeNullValues({ fullName: name }),
        withDeleted: deleted === "true" ? true : false,
        relations: ["devices"],
      });

      return res.json(patients);
    } catch (err) {
      next(err);
    }
  },

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const foundPatient = await repository.findByID(id, {
        relations: ["devices"],
      });

      return res.json(foundPatient);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const rawPatient = removeNullValues(req.body);

      const patient = Object.assign(new Patient(), rawPatient);

      const createdPatient = await repository.store(patient);

      return res.status(201).json(createdPatient);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const rawPatient = req.body;
      if (!rawPatient) res.json({ error: "Invalid body" });

      const patient = Object.assign(new Patient(), rawPatient);

      const updatedPatient = await repository.update(id, patient);

      res.json(updatedPatient);
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
};

export default PatientController;
