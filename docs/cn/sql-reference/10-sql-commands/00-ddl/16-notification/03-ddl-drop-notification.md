---
title: DROP NOTIFICATION INTEGRATION
sidebar_position: 3
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.371"/>

DROP NOTIFICATION INTEGRATION 语句用于删除现有的通知。

**注意:** 此功能在 Databend Cloud 中开箱即用。

## 语法

```sql
DROP NOTIFICATION INTEGRATION [ IF EXISTS ] <name>
```

| 参数                             | 描述                                                                                        |
|----------------------------------|------------------------------------------------------------------------------------------------------|
| IF EXISTS                        | 可选。如果指定，则仅在存在同名通知时删除通知。 |
| name                             | 通知的名称。这是一个必填字段。                                                       |


## 使用示例

```sql
DROP NOTIFICATION INTEGRATION IF EXISTS error_notification;
```

此命令删除名为 `error_notification` 的通知集成（如果存在）。