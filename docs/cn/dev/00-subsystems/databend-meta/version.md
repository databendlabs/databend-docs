---
title: 管理 Meta Server 和客户端的协议版本
sidebar_label: Meta Service Version
description:
  何时升级 Meta Server 或 Meta Client 的协议版本
---

:::tip

预计部署时间：**5 分钟 ⏱**

:::

Meta Server 有一个构建版本（`METASRV_COMMIT_VERSION`）和 Meta Client 的最小兼容版本（`MIN_METACLI_SEMVER`），
它们在 `src/meta/service/src/version.rs` 中定义。

Meta Client 有一个构建版本（`METACLI_COMMIT_SEMVER`）和 Meta Server 的最小兼容版本（`MIN_METASRV_SEMVER`），
它们在 `src/meta/grpc/src/lib.rs` 中定义。

这四个版本定义了 Meta Server 和 Meta Client 之间的兼容性。
[兼容性][Compatibility] 解释了它的工作原理。

对于开发人员，如果引入了不兼容或兼容的更改，则应增加 `MIN_METACLI_SEMVER` 或 `MIN_METASRV_SEMVER`，
以便在 Meta Server 和 Meta Client 之间进行实际数据交换之前报告兼容性问题。

根据 [兼容性][Compatibility] 定义的算法：

- 如果没有引入与协议相关的类型更改，请**不要**更改 `MIN_METACLI_SEMVER` 或 `MIN_METASRV_SEMVER`；
- 如果向 Meta Server 添加了新 API，但其他 API 仍然有效，请**不要**更改 `MIN_METACLI_SEMVER` 或 `MIN_METASRV_SEMVER`；
- 如果 Meta Client 开始使用 Meta Server 提供的新 API，请将 `MIN_METASRV_SEMVER` 升级到引入此新 API 的构建版本。
- 如果 Meta Server 删除了一个 API，请将 `MIN_METACLI_SEMVER` 升级到自此不再使用此 API 的客户端构建版本。

与协议相关的 crates 有（如果在将来引入新类型，则此列表可能不详尽）：
- `src/meta/protos`：定义 Meta Client 与 Meta Server 通信的 protobuf 消息。
- `src/meta/proto-conv`：定义如何将 rust 中的元数据类型从 protobuf 消息转换为 protobuf 消息。
- `src/meta/types`：定义元数据的 rust 类型。

[兼容性][Compatibility]
