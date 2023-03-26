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
import { MAX_PAGE_SIZE } from "../../../src/repositories/GenericRepository";

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

describe("Integration > Patients > Find", () => {
  // FIND ALL = = = = = = = = = = =  = = = = = = = = = = = = = = = = = = = = = =

  it("should not find-all patients, with not logged user", async function () {
    const baseRequest = request(app.expressApp).get("/patients");

    const response = await baseRequest.send();

    expect(response.status).toBe(401);
  });

  // FIND BY ID = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
  it("should not find-by-id any patient, with not logged user", async function () {
    const id = "any_id";

    // Make a GET request to the endpoint for retrieving a patient
    const baseRequest = request(app.expressApp).get(`/patients/${id}`);

    const response = await baseRequest.send();

    // Check if the response is a 404 error
    expect(response.status).toBe(401);
  });
});

describe("Integration > Patients > Find [as Admin]", () => {
  // FIND ALL = = = = = = = = = = =  = = = = = = = = = = = = = = = = = = = = = =

  it("should find-all empty patients", async function () {
    const authToken = await getAdminBearerToken();

    const baseRequest = request(app.expressApp)
      .get("/patients")
      .set("Authorization", authToken);

    const response = await baseRequest.send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.items).toBeDefined();
    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.totalPages).toBe(1);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.pageSize).toBe(MAX_PAGE_SIZE);
    expect(response.body.items.length).toBe(0);
  });

  it("should find-all patients", async function () {
    const authToken = await getAdminBearerToken();

    for (const patientData of patientsData) {
      await createPatient(app.expressApp, patientData, authToken);
    }

    const findAllRequest = request(app.expressApp)
      .get("/patients")
      .set("Authorization", authToken);

    const response = await findAllRequest.send();

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(patientsData.length);
  });

  it("should find-all patients with pagination", async function () {
    const authToken = await getAdminBearerToken();

    for (const patientData of patientsData) {
      await createPatient(app.expressApp, patientData, authToken);
    }

    const page = 1;
    const size = 1;
    const findAllRequest = request(app.expressApp)
      .get(`/patients?page=${page}&size=${size}`)
      .set("Authorization", authToken);

    const response = await findAllRequest.send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.items).toBeDefined();
    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.totalPages).toBe(3);
    expect(response.body.currentPage).toBe(1);
    expect(response.body.pageSize).toBe(1);
    expect(response.body.items.length).toBe(1);

    const page2 = 2;
    const size2 = 2;
    const findAllRequest2 = request(app.expressApp)
      .get(`/patients?page=${page2}&size=${size2}`)
      .set("Authorization", authToken);

    const response2 = await findAllRequest2.send();

    expect(response2.status).toBe(200);
    expect(response2.body.totalPages).toBe(2);
    expect(response2.body.currentPage).toBe(2);
    expect(response2.body.pageSize).toBe(2);
    expect(response2.body.items.length).toBe(1);
  });

  // FIND BY ID = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

  it("should not find-by-id a not existent patient", async function () {
    const authToken = await getAdminBearerToken();

    const id = "invalid_id";

    // Make a GET request to the endpoint for retrieving a patient
    const baseRequest = request(app.expressApp)
      .get(`/patients/${id}`)
      .set("Authorization", authToken);

    const response = await baseRequest.send();

    // Check if the response is a 404 error
    expect(response.status).toBe(404);
  });
});
