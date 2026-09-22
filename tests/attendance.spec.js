const { test, expect } = require('@playwright/test');
const {
  buildValidPayload,
  buildPayloadMissingMentorId,
  buildPayloadWithInvalidStatus,
  buildPayloadWithEmptyParticipants,
  buildPayloadWithDuplicateParticipantIds,
} = require('./fixtures');

test('happy path: valid payload returns 201', async ({ request }) => {
  const response = await request.post('/api/v1/attendance', { data: buildValidPayload() });
  expect(response.status()).toBe(201);
  const body = await response.json();
  expect(body.success).toBe(true);
});

const invalidCases = [
  {
    name: 'missing mentor_id',
    payload: buildPayloadMissingMentorId(),
    expectedError: 'mentor_id is required',
  },
  {
    name: 'invalid status value',
    payload: buildPayloadWithInvalidStatus(),
    expectedError: 'status must be one of',
  },
  {
    name: 'empty participants array',
    payload: buildPayloadWithEmptyParticipants(),
    expectedError: 'participants must be a non-empty array',
  },
  {
    name: 'duplicate participant_id',
    payload: buildPayloadWithDuplicateParticipantIds(),
    expectedError: 'duplicate participant_id',
  },
];

for (const { name, payload, expectedError } of invalidCases) {
  test(`validation failure: ${name} returns 400`, async ({ request }) => {
    const response = await request.post('/api/v1/attendance', { data: payload });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e) => e.includes(expectedError))).toBe(true);
  });
}