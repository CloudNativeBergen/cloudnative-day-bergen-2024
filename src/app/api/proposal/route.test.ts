/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it, jest, beforeEach } from '@jest/globals'
import * as appHandler from './route'
import { clientReadUncached } from '@/lib/sanity/client'
import proposals from '../../../../__tests__/testdata/proposals'
import { describe } from 'node:test'
import { testApiHandler } from 'next-test-api-route-handler'
import { Speaker } from '@/lib/speaker/types'

const speaker = proposals[0].speaker! as Speaker

beforeEach(() => {
  clientReadUncached.fetch = jest
    .fn<() => Promise<any>>()
    .mockResolvedValue(
      proposals.filter(
        (p) => p.speaker && '_id' in p.speaker && p.speaker._id === speaker._id,
      ),
    )
})

describe('GET /api/proposal', () => {
  it('should return 200 for authenticated user', async () => {
    await testApiHandler({
      appHandler,
      requestPatcher(request) {
        request.headers.set('x-test-auth-user', speaker._id!)
      },
      async test({ fetch }) {
        const res = await fetch({ method: 'GET' })
        expect(res.status).toBe(200)

        const body = await res.json()
        expect(body.proposals).toHaveLength(4)
        expect(
          body.proposals.every((p: any) => p.speaker._id === speaker._id),
        ).toBe(true)
      },
    })
  })
})
