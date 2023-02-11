/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  rootDir: "__tests__",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/utils"],
  verbose: true,
  testMatch: ["**/*.test.ts"],
};
