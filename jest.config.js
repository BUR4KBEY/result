/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  setupFilesAfterEnv: ['jest-extended/all'],
  testEnvironment: 'node',
  preset: 'ts-jest'
};
