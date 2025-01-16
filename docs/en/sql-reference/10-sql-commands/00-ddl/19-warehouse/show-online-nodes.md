---
title: SHOW ONLINE NODES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Lists all currently online nodes within the tenant, showing details such as node ID, type, node group, warehouse, cluster, and version.

## Syntax

```sql
SHOW ONLINE NODES
```

## Examples

```sql
SHOW ONLINE NODES;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│           id           │      type     │ node_group │ warehouse │ cluster │           version           │
├────────────────────────┼───────────────┼────────────┼───────────┼─────────┼─────────────────────────────┤
│ 9rabYMxa0ReDyZe6F9igH5 │ SystemManaged │ log_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ CbzfLlTVO29EhkZXdeR625 │ SystemManaged │ log_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ O0kOetbvkFjxrQ2kx4uMI  │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ R2epWlGVd8S0maSTuwbsv4 │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ SoZcaT4gmhVoGKcChlDw93 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ UeNVzwHCXhxJTTB4Xonj07 │ SystemManaged │ dev_node   │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ Zu7rmhVZ2s2HqTUCdFBdu2 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ bRubWZEzIibFgRgFad2MS3 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ ilPer0ps5wWnEDOLIlk821 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
│ shnWu1TC41sAxVwJMIVQF3 │ SystemManaged │ infra_node │           │         │ v1.2.665-nightly-bcb2c16f67 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```