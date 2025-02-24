---
title: SHOW ONLINE NODES
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

列出租户内所有当前在线的节点，显示节点 ID、类型、节点组、仓库、集群和版本等详细信息。

## 语法

```sql
SHOW ONLINE NODES
```

## 例子

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
