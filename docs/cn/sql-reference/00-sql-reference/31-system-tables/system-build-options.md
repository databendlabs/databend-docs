---
title: system.build_options
---

该系统表描述了当前 Databend 版本的构建选项。

- `cargo_features`: 已启用的包特性，这些特性在 `Cargo.toml` 的 `[features]` 部分中列出。
- `target_features`: 已为当前编译目标启用的平台特性。参考：[Conditional Compilation - `target_feature`](https://doc.rust-lang.org/reference/conditional-compilation.html#target_feature)。

```sql
SELECT * FROM system.build_options;
+----------------+---------------------+
| cargo_features | target_features     |
+----------------+---------------------+
| default        | fxsr                |
|                | llvm14-builtins-abi |
|                | sse                 |
|                | sse2                |
+----------------+---------------------+
4 rows in set (0.031 sec)
```
