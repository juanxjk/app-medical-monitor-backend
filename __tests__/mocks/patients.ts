import Patient, { GenderType } from "../../src/models/Patient";
import { AsStringAndNumbers } from "../utils/types";

export const patientsData: AsStringAndNumbers<Patient>[] = [
  {
    fullName: "João Carlos da Costa",
    cpf: "06601174897",
    gender: GenderType.Male,
    birthDate: "2023-01-29T05:30:34.947Z",
  },
  {
    fullName: "Ana Maria Silva",
    cpf: "90754812573",
    gender: GenderType.Female,
    birthDate: "2023-02-28T05:30:34.947Z",
  },
  {
    fullName: "Maria Luiza Rodrigues de Oliveira",
    cpf: "29116712854",
    gender: GenderType.Female,
    birthDate: "2023-03-30T05:30:34.947Z",
  },
];
