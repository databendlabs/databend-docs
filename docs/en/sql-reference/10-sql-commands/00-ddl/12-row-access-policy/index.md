---
title: Row Access Policy
---

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ROW ACCESS POLICY'/>

This page provides a comprehensive overview of Row Access Policy operations in Databend, organized by functionality for easy reference.

## Row Access Policy Management

| Command | Description |
|---------|-------------|
| [CREATE ROW ACCESS POLICY](create-row-access-policy.md) | Creates a row-level filter policy |
| [DESCRIBE ROW ACCESS POLICY](desc-row-access-policy.md) | Shows details of a row access policy |
| [DROP ROW ACCESS POLICY](drop-row-access-policy.md) | Removes a row access policy |

## Related Topics

- [Row Access Policy](/guides/security/data-protection/row-access-policy)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#row-access-policy-operations)
- [POLICY_REFERENCES](/sql/sql-functions/table-functions/policy-references)

:::note
Row access policies filter rows at query time. A protected table returns only the rows for which the policy expression evaluates to `TRUE`.
:::
