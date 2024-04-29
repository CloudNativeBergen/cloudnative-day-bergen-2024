/**
 * @jest-environment node
 */
import { expect, it } from '@jest/globals';
import { GET } from './route';
import nock from 'nock';

it('should return data with status 200', async () => {
  nock('https://api.github.com')
    .get('/user/emails')
    .reply(200, [
      { email: 'foo@bar.com', primary: true, verified: true, visibility: 'public' },
      { email: 'baz@bix.com', primary: false, verified: false, visibility: 'public' },
      { email: 'bar@foo.com', primary: false, verified: true, visibility: 'private' }
    ]);

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.emails).toHaveLength(2);
  expect(body.emails.every((email: any) => email.verified)).toBe(true);
});

it('should return default email if no verified email exists', async () => {
  nock('https://api.github.com')
    .get('/user/emails')
    .reply(200, [
      { email: 'test@example.com', primary: false, verified: false, visibility: 'public' }
    ]);

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.emails).toHaveLength(1);
  expect(body.emails[0].email).toBe('foo@bar.com'); // defined in __tests__/mocks/next-auth.ts
});

it('should return default email if request fails', async () => {
  nock('https://api.github.com')
    .get('/user/emails')
    .reply(500);

  const response = await GET();
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.emails).toHaveLength(1);
  expect(body.emails[0].email).toBe('foo@bar.com'); // defined in __tests__/mocks/next-auth.ts
});
