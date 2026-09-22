# Branch and pull request strategy

`main` contains runnable platform infrastructure only. Domain work lands through small, independently reviewable feature branches:

- `feat/tenancy-identity`
- `feat/catalog-inventory`
- `feat/billing-pos`
- `feat/purchasing`
- `feat/reporting`
- `feat/audit-outbox`

Each pull request must pass formatting, type checks, tests, and builds before merge.
