import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

type AppConfigType = {
  port: number;
  secret: string;
  bcryptRounds: number;
};

if (!process.env.JWTSECRET) throw new Error("[ERROR] JWTSECRET is not defined");

const appConfig: AppConfigType = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  secret: process.env.JWTSECRET,
  bcryptRounds: 10,
};

export default appConfig;
