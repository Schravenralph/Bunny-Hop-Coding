import type { Config } from 'jest';

const config: Config = {
  displayName: 'bunny-hop-coding',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: [
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ]
};

export default config;

