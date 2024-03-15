---
title: 显示共享端点
sidebar_position: 2
---

显示所有创建的共享端点。

## 语法

```sql
SHOW SHARE ENDPOINT
```

## 示例

以下示例显示租户上创建的所有共享端点：

```sql
SHOW SHARE ENDPOINT;

| Endpoint | URL                     | To Tenant | Args | Comment | Created On                        |
|----------|-------------------------|-----------|------|---------|-----------------------------------|
| to_share | http://127.0.0.1:23003/ | toronto   | {}   |         | 2023-09-14 03:13:50.014931007 UTC |
```