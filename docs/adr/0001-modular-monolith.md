# ADR 0001: Start with a modular monolith

## Status

Accepted.

## Decision

The API starts as one NestJS deployment with domain modules and a separate worker process. Billing, payment, and inventory mutations share a PostgreSQL transaction. Asynchronous side effects use a transactional outbox.

## Consequences

This keeps checkout consistency explicit, lowers initial operational overhead, and preserves clear service boundaries if a future module needs independent deployment.
