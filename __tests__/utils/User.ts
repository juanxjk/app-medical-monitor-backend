import { Express } from "express";
import request from "supertest";
import { AsStringAndNumbers } from "./types";
import User from "../../src/models/User";

export async function createUser(
  app: Express,
  token: string,
  rawPayload: AsStringAndNumbers<User> = {
    username: "user",
    email: "user@mail.com",
  }
): Promise<Partial<User> & Pick<User, "username" | "password" | "email">> {
  const baseRequest = request(app).post("/users").set("Authorization", token);

  const defaultValues = {
    fullname: "User full name",
    username: "user",
    password: "pass",
    email: "user@example.com",
  };

  const payload: AsStringAndNumbers<User> = {
    fullName: rawPayload.fullName ?? defaultValues.fullname,
    username: rawPayload.username ?? defaultValues.username,
    password: defaultValues.password,
    email: rawPayload.email ?? defaultValues.email,
  };
  const response = await baseRequest.send(payload);

  expect(response.status).toBe(201);

  const createdUser: Partial<User> &
    Pick<User, "username" | "password" | "email"> = response.body;
  createdUser.password = defaultValues.password;

  return createdUser;
}
