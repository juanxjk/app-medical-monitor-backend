import request from "supertest";

import App from "../../../src/App";
import {
  getApp,
  globalSetup,
  globalTeardown,
  resetDatabase,
} from "../../GlobalSetupAndTeardown";
import { patientsData } from "../../mocks/patients";
import { createPatient } from "../../utils/Patients";
import { getAdminBearerToken } from "../../utils/Sessions";

let app: App;

beforeAll(async () => {
  await globalSetup();
  app = getApp();
});

afterAll(async () => {
  await globalTeardown();
});

beforeEach(async () => {
  await resetDatabase();
});

describe("Integration > Patients > Create", () => {
  it("should not create a valid patient, with not logged user", async function () {
    const baseRequest = request(app.expressApp).post("/patients");

    const response = await baseRequest.send(patientsData[0]);

    expect(response.status).toBe(401);
  });
});

describe("Integration > Patients > Create [as Admin]", () => {
  it("should create, a valid patient", async function () {
    const authToken = await getAdminBearerToken();

    const createdPatient = await createPatient(
      app.expressApp,
      patientsData[0],
      authToken
    );

    expect(createdPatient.fullName).toBe(patientsData[0].fullName);
    expect(createdPatient.cpf).toBe(patientsData[0].cpf);
    expect(createdPatient.gender).toBe(patientsData[0].gender);
    expect(createdPatient.birthDate).toBe(patientsData[0].birthDate);
  });

  it("should create, a valid patient", async function () {
    const baseRequest = request(app.expressApp).post("/patients");

    const response = await baseRequest.send(patientsData[0]);

    expect(response.status).toBe(401);
  });

  it("should create, an invalid patient's full name", async function () {
    const authToken = await getAdminBearerToken();

    const baseRequest = request(app.expressApp)
      .post("/patients")
      .set("Authorization", authToken);

    const response = await baseRequest.send({
      ...patientsData[0],
      fullName: "111",
    });

    expect(response.status).toBe(400);
  });

  it("should create, an invalid patient's cpf: invalid format", async function () {
    const authToken = await getAdminBearerToken();

    const baseRequest = request(app.expressApp)
      .post("/patients")
      .set("Authorization", authToken);

    const response = await baseRequest.send({
      ...patientsData[0],
      cpf: "11111111111a",
    });

    expect(response.status).toBe(400);
  });

  it("should create, an invalid patient's cpf: invalid length", async function () {
    const authToken = await getAdminBearerToken();

    const baseRequest = request(app.expressApp)
      .post("/patients")
      .set("Authorization", authToken);

    const payloadData1 = {
      ...patientsData[0],
      cpf: "11111",
    };
    const response = await baseRequest.send(payloadData1);

    expect(response.status).toBe(400);
    expect(response.body.message).not.toBeUndefined();

    const payloadData2 = {
      ...patientsData[0],
      cpf: "11111111111111111111111",
    };
    const response2 = await baseRequest.send(payloadData2);

    expect(response2.status).toBe(400);
    expect(response2.body.message).not.toBeUndefined();
  });
});
