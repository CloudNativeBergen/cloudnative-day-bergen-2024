/**
 * @jest-environment node
 */
import { jest, it, describe, expect, beforeAll } from '@jest/globals';
import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from './route';
import { actionStateMachine } from '@/lib/proposal/states';
import { clientReadUncached, clientWrite } from '@/lib/sanity/client';
import proposals from '../../../../../../__tests__/testdata/proposals';
import { Action, Status } from '@/lib/proposal/types';
import { Speaker } from '@/lib/speaker/types';

let proposal = proposals[0]!;
let speaker = proposals[0].speaker! as Speaker;

beforeAll(async () => {
  try {
    ({ ...speaker, _type: 'speaker', _id: speaker._id! })
    clientWrite.createOrReplace({ ...proposal, _type: 'talk', _id: proposal._id!, speaker: { _type: 'reference', _ref: speaker._id! } })
  } catch (error) {
    expect(error).toBeNull();
  }
});

describe('actionStateMachine', () => {
  const testCases = [
    { currentStatus: Status.draft, action: Action.submit, isOrganizer: false, expectedStatus: Status.submitted, expectedValidAction: true },
    { currentStatus: Status.submitted, action: Action.unsubmit, isOrganizer: false, expectedStatus: Status.draft, expectedValidAction: true },
    { currentStatus: Status.submitted, action: Action.accept, isOrganizer: true, expectedStatus: Status.accepted, expectedValidAction: true },
    { currentStatus: Status.submitted, action: Action.accept, isOrganizer: false, expectedStatus: Status.submitted, expectedValidAction: false },
    { currentStatus: Status.submitted, action: Action.reject, isOrganizer: true, expectedStatus: Status.rejected, expectedValidAction: true },
    { currentStatus: Status.submitted, action: Action.reject, isOrganizer: false, expectedStatus: Status.submitted, expectedValidAction: false },
    { currentStatus: Status.accepted, action: Action.confirm, isOrganizer: false, expectedStatus: Status.confirmed, expectedValidAction: true },
    { currentStatus: Status.accepted, action: Action.withdraw, isOrganizer: false, expectedStatus: Status.withdrawn, expectedValidAction: true },
    { currentStatus: Status.confirmed, action: Action.withdraw, isOrganizer: false, expectedStatus: Status.withdrawn, expectedValidAction: true },
  ];

  testCases.forEach((testCase) => {
    it(`should transition from ${testCase.currentStatus} to ${testCase.expectedStatus} when action is ${testCase.action} and isOrganizer is ${testCase.isOrganizer}`, () => {
      const { status, isValidAction } = actionStateMachine(testCase.currentStatus, testCase.action, testCase.isOrganizer);
      expect(status).toBe(testCase.expectedStatus);
      expect(isValidAction).toBe(testCase.expectedValidAction);
    });
  });
});

describe('POST /api/proposal/[id]/action', () => {
  it('requires authentication', async () => {
    await testApiHandler({
      appHandler,
      params: { id: proposal._id! },
      async test({ fetch }) {
        const res = await fetch({ method: 'POST', body: '{"action": "foo"}' });
        expect(res.status).toBe(401);
      },
    });
  });

  it('requires a valid action', async () => {
    // Sanity is caching stuff, so let's mock the fetch to return the proposal
    clientReadUncached.fetch = jest.fn<() => Promise<any>>().mockResolvedValue(
      { ...proposal, _type: 'talk', _id: proposal._id!, speaker: { _type: 'reference', _ref: speaker._id! } }
    );

    await testApiHandler({
      appHandler,
      params: { id: proposal._id! },
      requestPatcher(request) {
        request.headers.set('x-test-auth-user', speaker._id!);
      },
      async test({ fetch }) {
        const res = await fetch({ method: 'POST', body: `{"action": "${Action.submit}"}` });
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ proposalStatus: Status.submitted, status: 200 });

        const doc = await clientWrite.getDocument(proposal._id!);
        expect(doc).not.toBeNull();
        expect(doc!.status).toBe(Status.submitted);
      }
    });
  });
});
