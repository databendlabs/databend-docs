---
title: 提交 PR 指南
sidebar_label: 提交 PR 指南
description: 你的第一个好的 Databend pull request
---

[Databend](https://github.com/databendlabs/databend) 是一个开源项目，每个人都可以贡献他们的代码，并将他们的创意变为现实。本主题帮助新的贡献者了解如何在 GitHub 上为 Databend 创建 pull request，并为代码贡献提供有用的注意事项。

:::tip
**你知道吗？** 为了表示感谢，您的 GitHub 用户名将在您的代码成功合并后添加到 `system.contributors` 表中。

查看它：

`SELECT * FROM system.contributors`
:::

## 前提条件

Databend 是用 Rust 编写的，要从头开始构建 Databend，您需要安装以下工具：

- **Git**
- **Rust** 使用 [rustup](https://rustup.rs/) 安装

## 编码规范

### 代码格式和分析

```shell
$ make lint
```

### 代码文档

任何公共字段、函数和方法都应该使用 [Rustdoc](https://doc.rust-lang.org/book/ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments) 进行文档化。

请遵循下面详细介绍的 `modules`、`structs`、`enums` 和 `functions` 的约定。当导航 Rustdoc 时，_单行_ 用作预览。例如，请参阅 [collections](https://doc.rust-lang.org/std/collections/index.html) Rustdoc 中的“Structs”和“Enums”部分。

```rust
/// [Single line] One line summary description
///
/// [Longer description] Multiple lines, inline code
/// examples, invariants, purpose, usage, etc.
[Attributes] If attributes exist, add after Rustdoc
```

以下示例：

```rust
/// Represents (x, y) of a 2-dimensional grid
///
/// A line is defined by 2 instances.
/// A plane is defined by 3 instances.
#[repr(C)]
struct Point {
    x: i32,
    y: i32,
}
```

## 贡献文档

我们欢迎您在编写代码的同时，为 Databend 文档做出贡献！Databend 文档由 markdown 文件组成，这使得编写和维护变得容易。为了确保高质量的文档，我们建议使用 [Visual Studio Code](https://code.visualstudio.com/) 作为您的 markdown 编辑器。此外，安装 [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) 扩展程序将帮助您发现任何拼写错误。

当提交新命令或函数的文档时，必须遵守提供的模板和指南，以保持一致性并确保 Databend 文档的清晰度。这些模板旨在包含所有必要的信息和格式约定，使用户更容易理解和使用命令或函数。

- [command-template](https://github.com/databendlabs/databend/blob/d3a40d91b8a8ebaf878344e024164f36b6db5615/docs/public/templates/command-template.md?plain=1)
- [function-template](https://github.com/databendlabs/databend/blob/d3a40d91b8a8ebaf878344e024164f36b6db5615/docs/public/templates/function-template.md?plain=1)

除了遵循模板之外，请注意其中包含的代码。代码的目的是明确指出新命令或函数是否仅适用于 Databend Enterprise，并提供有关何时引入命令或函数的信息。此上下文信息对于用户至关重要，因为它允许他们准确评估功能的范围和限制。它还使用户能够识别支持该功能的 Databend 的特定版本，从而使他们能够有效地规划其使用。

## Pull Requests

### 提交 PR

1. Fork `databend` 仓库，并从 `main` 创建您的分支。
2. 打开一个常规 [issue](https://github.com/databendlabs/databend/issues/new/choose) 以绑定 pull request。
3. 提交一个 [Draft Pull Requests](https://github.blog/2019-02-14-introducing-draft-pull-requests/)，标记您正在进行的工作。
4. 如果您添加了应该测试的代码，请添加单元测试。
5. 验证并确保测试套件通过，`make test`。
6. 确保您的代码通过了两个 linters，`make lint`。
7. 将状态更改为“Ready for review”。
8. 注意来自 `@mergify` 的回复，她将是您的指导。

### PR 标题

格式：`<type>(<scope>): <subject>`

`<scope>` 是可选的

```
fix(query): fix group by string bug
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: rfc, feat, fix, refactor, ci, docs, chore
```

更多类型：

- `rfc`: 此 PR 提出了一个新的 RFC
- `feat`: 此 PR 向代码库引入了一个新功能
- `fix`: 此 PR 修复了代码库中的一个错误
- `refactor`: 此 PR 更改了代码库，但没有新功能或错误修复
- `ci`: 此 PR 更改了构建/ci 步骤
- `docs`: 此 PR 更改了文档或网站
- `chore`: 此 PR 只有小的更改，不需要记录，例如编码风格。

### PR 模板

Databend 有一个 [Pull Request Template](https://github.com/databendlabs/databend/blob/main/.github/PULL_REQUEST_TEMPLATE.md):

```shell
I hereby agree to the terms of the CLA available at: https://docs.databend.com/dev/policies/cla

## Summary

Summary about this PR

Fixes #issue
```

您不应该更改 PR 模板上下文，但需要完成：

- `Summary` - 描述构成 Pull Request 的内容以及您对代码所做的更改。例如，修复哪个 issue。

## 测试

_单元测试_

```shell
$ make unit-test
```

_无状态测试_

```shell
$ make stateless-test
```

## Issues

Databend 使用 [GitHub issues](https://github.com/databendlabs/databend/issues) 来跟踪错误。请包括必要的信息和说明来重现您的问题。

## 文档

所有开发者文档都发布在 Databend 开发者网站 [databend.com](/guides) 上。

## 行为准则

请参阅 [行为准则](/dev/policies/code-of-conduct)，其中描述了社区内互动的期望。
