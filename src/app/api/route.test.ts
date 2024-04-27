/**
 * @jest-environment node
 */
import { expect, it } from '@jest/globals';
import { GET } from './route';

it('should return data with status 200', async () => {
  const response = await GET();
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.message).toBe('Hello, world!');
});
