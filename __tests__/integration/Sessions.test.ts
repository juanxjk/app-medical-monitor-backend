import request from "supertest";

import App from "../../src/App";
import {
  getApp,
  globalSetup,
  globalTeardown,
  resetDatabase,
} from "../GlobalSetupAndTeardown";

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

describe("Integration > Sessions", () => {
  it("should be able to authenticate with default admin user", async function () {
    const requestobj = request(app.expressApp).post("/sessions");
    const authResponse = await requestobj.send({
      username: "admin",
      password: "admin",
    });

    expect(authResponse.status).toBe(200);
    const { token } = authResponse.body;
    expect(token).not.toBeUndefined();
    expect(token).not.toBeNull();
  });

  it("should not authenticate with not registed user", async function () {
    const requestobj = request(app.expressApp).post("/sessions");
    const authResponse = await requestobj.send({
      username: "invaliduser",
      password: "12345",
    });

    expect(authResponse.status).toBe(404);
    const { token } = authResponse.body;
    expect(token).toBeUndefined();
  });

  it("should not authenticate with no password", async function () {
    const requestobj = request(app.expressApp).post("/sessions");
    const authResponse = await requestobj.send({
      username: "invaliduser",
      password: "",
    });

    expect(authResponse.status).toBe(400);
    const { token } = authResponse.body;
    expect(token).toBeUndefined();
  });

  it("should not authenticate with no username", async function () {
    const requestobj = request(app.expressApp).post("/sessions");
    const authResponse = await requestobj.send({
      username: "",
      password: "12345",
    });

    expect(authResponse.status).toBe(400);
    const { token } = authResponse.body;
    expect(token).toBeUndefined();
  });

  it("should not authenticate with username beginning with number", async function () {
    const requestobj = request(app.expressApp).post("/sessions");
    const authResponse = await requestobj.send({
      username: "1user",
      password: "12345",
    });

    expect(authResponse.status).toBe(400);
    const { token } = authResponse.body;
    expect(token).toBeUndefined();
  });
});
