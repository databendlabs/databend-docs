---
title: VERSION
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

返回当前 DatabendQuery 的版本信息。

## 语法

```sql
VERSION()
```

<a id="version-format"></a>

## 版本格式

从 v1.2.953 开始，构建过程会从嵌入的 Databend 版本中移除结尾的 `-nightly` 后缀。发布 tag 保留原名称。

| 构建版本输入 | 嵌入的 Databend 版本 |
|---------------------|---------------------------|
| `v1.2.953-nightly` | `v1.2.953` |
| `v1.2.953` | `v1.2.953` |
| `v1.2.953-p2` | `v1.2.953-p2` |
| `v1.2.953-rc.1` | `v1.2.953-rc.1` |

这些映射说明版本格式，不代表已发布版本列表。构建输入可以来自发布 tag 或 `DATABEND_RELEASE_VERSION`。其他后缀保持不变。

完整版本字符串仍包含提交和构建信息。Rust 编译器元数据可能包含 `nightly`；这不表示 Databend 版本保留了该后缀。结果前缀可能因客户端协议而异。MySQL 连接使用兼容版本前缀；上述规则针对嵌入的 Databend 版本，而不是整个结果。

不要根据结果中没有 `-nightly` 来推断发布渠道。识别构建时，请检查发布 tag。请参阅 [Databend 发布渠道](/release-notes/release-channels)。

## 示例

以下历史输出来自格式变更之前的 v1.2.252，保留旧的 Databend `-nightly` 后缀：

```sql
SELECT VERSION();

┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           version()                                           │
├───────────────────────────────────────────────────────────────────────────────────────────────┤
│ DatabendQuery v1.2.252-nightly-193ed56304(rust-1.75.0-nightly-2023-12-12T22:07:25.371440000Z) │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```