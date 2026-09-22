# ADR 0002: REST for browser-to-API communication

## Status

Accepted.

## Decision

The browser uses REST/JSON for commands and queries. WebSocket or SSE carries live updates. gRPC is reserved for future service-to-service communication after a real deployment boundary exists.
