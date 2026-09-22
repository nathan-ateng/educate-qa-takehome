function buildValidPayload(overrides = {}) {
  return {
    mentor_id: 'MNT-1042',
    participants: [{ participant_id: 'YTH-8821', status: 'PRESENT' }],
    ...overrides,
  };
}

function buildPayloadMissingMentorId() {
  const payload = buildValidPayload();
  delete payload.mentor_id;
  return payload;
}

function buildPayloadWithInvalidStatus() {
  return buildValidPayload({
    participants: [{ participant_id: 'YTH-8821', status: 'LATE' }],
  });
}

function buildPayloadWithEmptyParticipants() {
  return buildValidPayload({ participants: [] });
}

function buildPayloadWithDuplicateParticipantIds() {
  return buildValidPayload({
    participants: [
      { participant_id: 'YTH-8821', status: 'PRESENT' },
      { participant_id: 'YTH-8821', status: 'ABSENT' },
    ],
  });
}

module.exports = {
  buildValidPayload,
  buildPayloadMissingMentorId,
  buildPayloadWithInvalidStatus,
  buildPayloadWithEmptyParticipants,
  buildPayloadWithDuplicateParticipantIds,
};