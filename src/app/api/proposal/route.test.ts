/**
 * @jest-environment node
 */
import { expect, it, jest, beforeEach } from '@jest/globals';
import { GET } from './route';
import { clientReadUncached } from '@/lib/sanity/client';
import proposals from '../../../../__tests__/testdata/proposals';

beforeEach(() => {
  clientReadUncached.fetch = jest.fn<() => Promise<any>>().mockResolvedValue(
    proposals.filter((p) => p.speaker?._id === '1')
  );
});

it('should return data with status 200', async () => {
  const response = await GET();
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.proposals).toHaveLength(3);
  expect(body.proposals[0].speaker?._id).toBe('1');
});
