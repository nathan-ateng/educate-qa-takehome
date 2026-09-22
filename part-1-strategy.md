# Part 1: QA Strategy & Release Readiness

## Definition of Done — Participant Registration & Attendance

### Feature behaves correctly
- Registration works on web and USSD with valid input. Age boundary tested at 14, 15, 24, and 25.
- Retrying a dropped connection mid-registration doesn't create a second record for the same person — sync needs an idempotency key.
- USSD registration returns a unique 6-digit Participant ID by SMS. *Assumption: "immediate" has no defined SLA in the AC — proposing 30 seconds as the target, pending PO input, so this is actually testable.*

### Ready for production
Reviewed and merged, regression suite green, no open P1/P2s, monitoring in place for sync and SMS failures, rollback or feature-flag path available. PO has seen the three ACs demoed specifically, not just a general walkthrough.

## Two risks

1. No idempotency key on sync — a retried request creates a duplicate participant record instead of updating the existing one. Already surfaced as Bug B below.
2. Offline queue has no durability guarantee — a crash, dead battery, or reinstall before syncing loses the registration with no trace it happened. Where risk #1 duplicates a youth, this one drops them from the program entirely.

## Bug Triage

**Framework: Severity (Blocker / Critical / Major / Minor / Trivial) — Priority (P1–P4)**

### Bug A — district dropdown off-screen on low-end mobile browsers
- Severity: Critical. District is required; if the dropdown is unreachable, registration can't be completed on that device, no known workaround.
- Priority: P2, pending device-mix data. Field mentors working in rural areas plausibly skew toward low-end Android — if that's confirmed, this moves to P1.

### Bug B — duplicate records on reconnect
- Severity: Critical. Silent data corruption in the exact offline-sync scenario named in AC #2 — no user-visible signal it happened.
- Priority: P1, full stop. Even if ops can manually merge duplicates after the fact, that's damage control, not a fix — it doesn't reduce how bad the underlying bug is.

### Bug C — SMS confirmation takes up to 4 minutes
- Severity: Minor. Nothing breaks or gets lost, just slow — fails AC #3 as written but isn't a functional failure.
- Priority: P3, pending PO input on whether the mentor waits on-site with the youth for the ID. If they do, this moves to P2.

**Open questions before these are final:** actual device distribution among field mentors, whether mentors wait on-site for SMS confirmation.