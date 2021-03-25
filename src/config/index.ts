import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

type AppConfigType = {
  port: number;
  bcryptRounds: number;
};
const appConfig: AppConfigType = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  bcryptRounds: 10,
};

export default appConfig;
