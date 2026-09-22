const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.post('/api/v1/attendance', (req, res) => {
  const body = req.body;
  const errors = [];
  const validStatuses = ['PRESENT', 'ABSENT', 'EXCUSED'];

  if (!body.mentor_id) {
    errors.push('mentor_id is required');
  }

  if (!Array.isArray(body.participants) || body.participants.length === 0) {
    errors.push('participants must be a non-empty array');
  } else {
    const seenIds = new Set();
    body.participants.forEach((p, i) => {
      if (!p.participant_id) {
        errors.push(`participants[${i}].participant_id is required`);
      } else if (seenIds.has(p.participant_id)) {
        errors.push(`duplicate participant_id "${p.participant_id}"`);
      } else {
        seenIds.add(p.participant_id);
      }

      if (!validStatuses.includes(p.status)) {
        errors.push(`participants[${i}].status must be one of ${validStatuses.join(', ')}`);
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  res.status(201).json({ success: true });
});
module.exports = { app };
if (require.main === module) {
  app.listen(4000, () => console.log('running on 4000'));
}