---
title: INSPECT WAREHOUSE
sidebar_position: 7
---

显示当前分配给某个计算集群的节点。

:::note
此命令依赖 system management 功能，并需要企业版许可证。
:::

## 语法

```sql
INSPECT WAREHOUSE <warehouse_name>
```

## 输出

`INSPECT WAREHOUSE` 返回以下列：

| 列名 | 说明 |
|--------|-------------|
| `cluster` | 计算集群内部的 cluster 标识 |
| `node` | 节点标识 |
| `type` | 节点类型，例如 `SelfManaged` 或 `SystemManaged` |

## 示例

```sql
INSPECT WAREHOUSE etl_wh;
```
