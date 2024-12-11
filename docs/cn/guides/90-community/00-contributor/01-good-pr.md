---
title: 你的第一个 Databend PR
sidebar_label: 第一个 Pull Request
description: 你的第一个 Databend Pull Request
---

[Databend](https://github.com/databendlabs/databend) 是一个开源项目，每个人都可以贡献代码，将自己的创意变为现实。本主题帮助新贡献者了解如何在 GitHub 上为 Databend 创建 Pull Request，并提供代码贡献的有用考虑。

:::tip
**你知道吗？** 为了表示感谢，你的 GitHub 用户名将在代码成功合并后被添加到 `system.contributors` 表中。

查看一下：

`SELECT * FROM system.contributors`
:::

## 前提条件

Databend 是用 Rust 编写的，要构建 Databend，你需要安装以下工具：

- **Git**
- **Rust** 通过 [rustup](https://rustup.rs/) 安装

## 编码指南

### 代码格式和分析

```shell
$ make lint
```

### 代码文档

任何公共字段、函数和方法都应使用 [Rustdoc](https://doc.rust-lang.org/book/ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments) 进行文档化。

请按照以下约定为 `modules`、`structs`、`enums` 和 `functions` 编写文档。_单行_ 用于在浏览 Rustdoc 时的预览。例如，请参阅 [collections](https://doc.rust-lang.org/std/collections/index.html) Rustdoc 中的 'Structs' 和 'Enums' 部分。

```rust
/// [单行] 一行摘要描述
///
/// [更长的描述] 多行，内联代码
/// 示例，不变量，目的，用法等。
[属性] 如果存在属性，请在 Rustdoc 后添加
```

示例如下：

```rust
/// 表示二维网格的 (x, y)
///
/// 一条线由 2 个实例定义。
/// 一个平面由 3 个实例定义。
#[repr(C)]
struct Point {
    x: i32,
    y: i32,
}
```

## 贡献文档

我们欢迎你与代码一起贡献 Databend 文档！Databend 文档由 markdown 文件组成，这使得编写和维护变得容易。为了确保高质量的文档，我们推荐使用 [Visual Studio Code](https://code.visualstudio.com/) 作为你的 markdown 编辑器。此外，安装 [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) 扩展将帮助你捕捉任何拼写错误。

在为新命令或函数提交文档时，务必遵循提供的模板和指南，以保持一致性并确保 Databend 文档的清晰性。这些模板旨在包含所有必要的信息和格式约定，使用户更容易理解和使用命令或函数。

- [command-template](https://github.com/databendlabs/databend/blob/d3a40d91b8a8ebaf878344e024164f36b6db5615/docs/public/templates/command-template.md?plain=1)
- [function-template](https://github.com/databendlabs/databend/blob/d3a40d91b8a8ebaf878344e024164f36b6db5615/docs/public/templates/function-template.md?plain=1)

除了遵循模板外，请注意其中的代码。代码的目的是明确指示新命令或函数是否仅适用于 Databend Enterprise，并提供有关命令或函数引入时间的信息。这些上下文信息对用户至关重要，因为它允许他们准确评估功能的范围和限制。它还使用户能够识别支持该功能的具体 Databend 版本，从而有效地规划其使用。

## Pull Requests

### 提交 PR

1. Fork `databend` 仓库并在 `main` 分支上创建你的分支。
2. 为绑定 Pull Request 打开一个常规的 [issue](https://github.com/databendlabs/databend/issues/new/choose)。
3. 提交一个 [Draft Pull Requests](https://github.blog/2019-02-14-introducing-draft-pull-requests/)，标记你的工作正在进行中。
4. 如果你添加了需要测试的代码，请添加单元测试。
5. 验证并确保测试套件通过，`make test`。
6. 确保你的代码通过所有 linter，`make lint`。
7. 将状态更改为 "Ready for review"。
8. 注意 `@mergify` 的回复，她将是你的向导。

### PR 标题

格式：`<type>(<scope>): <subject>`

`<scope>` 是可选的

```
fix(query): fix group by string bug
^--^  ^------------^
|     |
|     +-> 现在时态的摘要。
|
+-------> 类型：rfc, feat, fix, refactor, ci, docs, chore
```

更多类型：

- `rfc`: 此 PR 提出了一个新的 RFC
- `feat`: 此 PR 在代码库中引入了一个新功能
- `fix`: 此 PR 修复了代码库中的一个 bug
- `refactor`: 此 PR 更改了代码库，但没有新功能或 bug 修复
- `ci`: 此 PR 更改了构建/CI 步骤
- `docs`: 此 PR 更改了文档或网站
- `chore`: 此 PR 只有不需要记录的小更改，如编码风格。

### PR 模板

Databend 有一个 [Pull Request Template](https://github.com/databendlabs/databend/blob/main/.github/PULL_REQUEST_TEMPLATE.md)：

```shell
我同意 CLA 的条款，可在以下网址查看：https://docs.databend.com/dev/policies/cla

## 摘要

此 PR 的摘要

修复 #issue
```

你不应更改 PR 模板内容，但需要完成：

- `Summary` - 描述 Pull Request 的内容以及你对代码所做的更改。例如，修复了哪个 issue。

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

Databend 使用 [GitHub issues](https://github.com/databendlabs/databend/issues) 来跟踪 bug。请包含必要的信息和重现你问题的说明。

## 文档

所有开发者文档都发布在 Databend 开发者网站上，[databend.com](/guides)。

## 行为准则

请参考 [行为准则](/dev/policies/code-of-conduct)，其中描述了社区内互动的期望。
