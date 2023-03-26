import request from "supertest";
import { getApp } from "../GlobalSetupAndTeardown";

async function getTokenFromUser(
  username: string,
  password: string
): Promise<string> {
  const app = getApp();
  const requestobj = request(app.expressApp).post("/sessions");
  const authResponse = await requestobj.send({
    username,
    password,
  });

  expect(authResponse.status).toBe(200);
  const { token } = authResponse.body;
  expect(token).not.toBeUndefined();
  expect(token).not.toBeNull();

  return token;
}

export async function getAdminBearerToken(): Promise<string> {
  const token = await getTokenFromUser("admin", "admin");

  return `Bearer ${token}`;
}

export async function getBearerToken(
  username: string,
  password: string
): Promise<string> {
  const token = await getTokenFromUser(username, password);

  return `Bearer ${token}`;
}
