---
title: DROP NOTIFICATION INTEGRATION
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.371"/>

DROP NOTIFICATION INTEGRATION 语句用于删除现有的 notification。

**注意：** 此功能仅在 Databend Cloud 中开箱即用。

## 语法

```sql
DROP NOTIFICATION INTEGRATION [ IF EXISTS ] <name>
```

| 参数                           | 描述                                                                                             |
|----------------------------------|----------------------------------------------------------------------------------------------------|
| IF EXISTS                        | 可选。如果指定，则仅当已存在同名的 notification 时，才会删除该 notification。                                            |
| name                             | notification 的名称。这是一个必填字段。                                                                |


## 使用示例

```sql
DROP NOTIFICATION INTEGRATION IF EXISTS error_notification;
```

此命令删除名为 `error_notification` 的 notification integration（如果存在）。