/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  preset: 'ts-jest'
};
