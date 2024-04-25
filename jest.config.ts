import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '@/lib/auth': '<rootDir>/__tests__/mocks/lib/auth.ts',
    '@/lib/proposal/sanity': '<rootDir>/__tests__/mocks/lib/proposal/sanity.ts',
    '@/lib/speaker/sanity': '<rootDir>/__tests__/mocks/lib/speaker/sanity.ts',
    '@/lib/sanity/client': '<rootDir>/__tests__/mocks/lib/sanity/client.ts',
    'next-auth/providers/credentials': '<rootDir>/__tests__/mocks/next-auth-providers-credentials.ts',
    'next-auth': '<rootDir>/__tests__/mocks/next-auth.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);