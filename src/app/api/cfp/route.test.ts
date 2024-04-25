/**
 * @jest-environment node
 */
import { expect, it, jest } from '@jest/globals';
import { GET } from './route';
import { getProposals } from '@/lib/proposal/sanity';
import { auth } from '@/lib/auth';

//jest.mock('@/lib/auth', () => ({
//  auth: jest.fn((handler) => handler),
//}));

jest.mock('@/lib/proposal/sanity', () => ({
  getProposals: jest.fn(),
}));

jest.mock('@/lib/sanity/client', () => ({
  clientRead: jest.fn(),
  clientWrite: jest.fn(),
}));

it('should return data with status 200', async () => {
  const response = await GET();
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.message).toBe('Hello, world!');
});
