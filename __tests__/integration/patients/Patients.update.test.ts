import request from "supertest";

import App from "../../../src/App";
import Patient from "../../../src/models/Patient";
import {
  getApp,
  globalSetup,
  globalTeardown,
  resetDatabase,
} from "../../GlobalSetupAndTeardown";
import { patientsData } from "../../mocks/patients";
import { createPatient } from "../../utils/Patients";
import { getAdminBearerToken } from "../../utils/Sessions";
import { AsStringAndNumbers } from "../../utils/types";

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

describe("Integration > Patients > Update", () => {
  it("should not update a patient, with not logged user", async function () {
    const authToken = await getAdminBearerToken();

    const createdPatient = await createPatient(
      app.expressApp,
      patientsData[0],
      authToken
    );

    const updatePayload = {
      fullname: "new full name",
    };

    const baseRequest = request(app.expressApp).patch(
      `/patients/${createdPatient.id}`
    );

    const response = await baseRequest.send(updatePayload);

    expect(response.status).toEqual(401);
  });
});

describe("Integration > Patients > Update [as Admin]", () => {
  const expectedUpdatedData: AsStringAndNumbers<Patient> = {
    fullName: "new full name",
    cpf: "11122233344",
    gender: "female",
    bed: "bed 1",
    prognosis: "prognosis 1",
    illnesses: ["illness 1", "illness 2", "illness 3"],
    comorbidities: ["comorbidity 1", "comorbidity 2", "comorbidity 3"],
  };

  it("should not update a not found patient", async function () {
    const authToken = await getAdminBearerToken();

    const id = "invalid_id";
    const baseRequest = request(app.expressApp)
      .patch(`/patients/${id}`)
      .set("Authorization", authToken);

    const response = await baseRequest.send();

    expect(response.status).toEqual(404);
  });

  it("should update each patient's fields", async function () {
    const authToken = await getAdminBearerToken();

    const createdPatient = await createPatient(
      app.expressApp,
      patientsData[0],
      authToken
    );

    for (const field in expectedUpdatedData) {
      const expectedData =
        expectedUpdatedData[field as keyof AsStringAndNumbers<Patient>];

      const updatePayload: AsStringAndNumbers<Patient> = {
        [field]: expectedData,
      };

      const baseRequest = request(app.expressApp)
        .patch(`/patients/${createdPatient.id}`)
        .set("Authorization", authToken);

      const response = await baseRequest.send(updatePayload);

      expect(response.status).toEqual(200);

      const updatedPatient = response.body;

      expect(updatedPatient[field]).toEqual(expectedData);
    }
  });

  it("should update patient with multiple fields", async function () {
    const authToken = await getAdminBearerToken();

    const createdPatient = await createPatient(
      app.expressApp,
      patientsData[0],
      authToken
    );

    const updatePayload: AsStringAndNumbers<Patient> = expectedUpdatedData;

    const baseRequest = request(app.expressApp)
      .patch(`/patients/${createdPatient.id}`)
      .set("Authorization", authToken);

    const response = await baseRequest.send(updatePayload);

    expect(response.status).toEqual(200);

    const updatedPatient = response.body;

    for (const field in expectedUpdatedData) {
      expect(updatedPatient[field as string]).toEqual(
        expectedUpdatedData[field as keyof AsStringAndNumbers<Patient>]
      );
    }
  });
});
