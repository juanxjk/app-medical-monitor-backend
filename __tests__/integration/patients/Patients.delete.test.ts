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
import { getAdminBearerToken, getBearerToken } from "../../utils/Sessions";
import { createUser } from "../../utils/User";

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

describe("Integration > Patients > Delete", () => {
  it("should not delete a patient, with not logged user", async function () {
    const id = "any_id";
    const baseRequest = request(app.expressApp).delete(`/patients/${id}`);

    const response = await baseRequest.send();

    expect(response.status).toBe(401);
  });
});

describe("Integration > Patients > Delete [as Admin]", () => {
  it("should not delete a not existent patient", async function () {
    const authToken = await getAdminBearerToken();

    const id = "invalid_id";
    const baseRequest = request(app.expressApp)
      .delete(`/patients/${id}`)
      .set("Authorization", authToken);

    const response = await baseRequest.send();

    expect(response.status).toBe(404);
  });

  it("should delete a patient by ID from other user", async function () {
    const adminToken = await getAdminBearerToken();

    const user = await createUser(app.expressApp, adminToken);
    const userToken = await getBearerToken(user.username, user.password);

    // First, create a patient to be deleted
    const createdPatient = await createPatient(
      app.expressApp,
      patientsData[0],
      userToken
    );

    // Then, make a DELETE request to the endpoint for deleting a patient
    const baseRequest = request(app.expressApp)
      .delete(`/patients/${createdPatient.id}`)
      .set("Authorization", adminToken);

    const response = await baseRequest.send();

    // Check if the response is successful
    expect(response.status).toBe(204);

    // Make a GET request to retrieve the deleted patient, to make sure it was deleted
    const baseGetRequest = request(app.expressApp)
      .get(`/patients/${createdPatient.id}`)
      .set("Authorization", adminToken);

    const getResponse = await baseGetRequest.send();

    // Check if the patient was indeed deleted
    expect(getResponse.status).toBe(404);
  });

  it("should delete a patient by ID", async function () {
    const authToken = await getAdminBearerToken();

    // First, create a patient to be deleted
    const createdPatient = await createPatient(
      app.expressApp,
      patientsData[0],
      authToken
    );

    // Then, make a DELETE request to the endpoint for deleting a patient
    const baseRequest = request(app.expressApp)
      .delete(`/patients/${createdPatient.id}`)
      .set("Authorization", authToken);

    const response = await baseRequest.send();

    // Check if the response is successful
    expect(response.status).toBe(204);

    // Make a GET request to retrieve the deleted patient, to make sure it was deleted
    const baseGetRequest = request(app.expressApp)
      .get(`/patients/${createdPatient.id}`)
      .set("Authorization", authToken);

    const getResponse = await baseGetRequest.send();

    // Check if the patient was indeed deleted
    expect(getResponse.status).toBe(404);
  });
});
