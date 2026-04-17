---
title: SHOW ONLINE NODES
sidebar_position: 7
---

列出当前 tenant 可见的在线查询节点。

:::note
此命令依赖 system management 功能，并需要企业版许可证。
:::

## 语法

```sql
SHOW ONLINE NODES
```

## 输出

`SHOW ONLINE NODES` 返回以下列：

| 列名 | 说明 |
|--------|-------------|
| `id` | 节点标识 |
| `type` | 节点类型，例如 `SelfManaged` 或 `SystemManaged` |
| `group` | 节点组 |
| `warehouse` | 计算集群标识 |
| `cluster` | 集群标识 |
| `version` | 二进制版本 |

## 示例

```sql
SHOW ONLINE NODES;
```
