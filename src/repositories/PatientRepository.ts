import GenericRepository from "./GenericRepository";
import Patient from "../models/Patient";

export default class PatientRepository extends GenericRepository<Patient> {
  constructor() {
    super(Patient);
  }
}
