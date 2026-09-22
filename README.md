# Attendance API Test Suite

Automated tests for `POST /api/v1/attendance` (Educate! Senior QA take-home, Part 2).

## Stack

- Playwright Test (`@playwright/test`), using its built-in `request` fixture — pure HTTP testing, no browser launched.
- A small in-memory Express mock server stands in for the real endpoint, enforcing the validation rules implied by the sample payload (required fields, status enum, non-empty participants, no duplicate `participant_id` within a request).

## Run it

npm install
npx playwright test

Playwright starts the mock server automatically before the tests run and shuts it down after — no separate terminal needed.

## Test cases

1. Happy path — valid payload → 201
2. Validation failure — missing `mentor_id` → 400
3. Validation failure — invalid `status` value (`"LATE"`) → 400
4. Edge case — empty `participants` array → 400
5. Edge case — duplicate `participant_id` within one request → 400

## Assumptions

- The assessment's example list for "validation failure" mentions "age out of bounds," but the attendance payload shown has no age field — that belongs to the separate registration payload from a different part of the assessment. This suite validates fields that actually exist on this payload instead.
- Status enum assumed to be `PRESENT` / `ABSENT` / `EXCUSED`; only `PRESENT` and `ABSENT` appear in the sample payload.
- Duplicate detection is scoped to one request. Cross-request duplicate detection would need persistent state and is a reasonable next step.

## Sample for actions run