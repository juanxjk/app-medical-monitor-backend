import { Express } from "express";
import request from "supertest";
import Patient from "../../src/models/Patient";
import { AsStringAndNumbers } from "./types";

export async function createPatient(
  app: Express,
  payload: AsStringAndNumbers<Patient>,
  token: string
): Promise<Partial<Patient>> {
  const baseRequest = request(app)
    .post("/patients")
    .set("Authorization", token);

  const response = await baseRequest.send(payload);
  expect(response.status).toBe(201);

  const createdPatient: Partial<Patient> = response.body;

  return createdPatient;
}
