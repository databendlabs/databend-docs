---
title: 为 Databend 提交您的第一个 PR
sidebar_label: 第一个 Pull Request
description:
  您对 Databend 的第一个好的 pull request
---

[Databend](https://github.com/datafuselabs/databend) 是一个开源项目，每个人都可以贡献他们的代码并将他们的创意想法变为现实。本主题帮助新贡献者了解如何在 GitHub 上为 Databend 创建一个 pull request，并提供了对代码贡献的有用考虑。

:::tip
**你知道吗？** 为了表达我们的感激之情，您的 GitHub 用户名将在您的代码成功合并后被添加到表 `system.contributors` 中。

查看一下：

`SELECT * FROM system.contributors`
:::

## 先决条件

Databend 是用 Rust 编写的，要从头开始构建 Databend，您需要安装以下工具：
* **Git**
* **Rust** 通过 [rustup](https://rustup.rs/) 安装

## 编码指南

### 代码格式和分析

```shell
$ make lint
```

### 代码文档

任何公共字段、函数和方法都应该用 [Rustdoc](https://doc.rust-lang.org/book/ch14-02-publishing-to-crates-io.html#making-useful-documentation-comments) 文档化。

请按照下面详细说明的约定来编写 `modules`、`structs`、`enums` 和 `functions` 的文档。*单行* 用作在 Rustdoc 中导航时的预览。作为示例，请参见 [collections](https://doc.rust-lang.org/std/collections/index.html) Rustdoc 中的 'Structs' 和 'Enums' 部分。

 ```rust
 /// [单行] 一行摘要描述
 ///
 /// [较长描述] 多行，内联代码
 /// 示例，不变量，目的，用法等。
 [属性] 如果存在属性，添加在 Rustdoc 之后
 ```

下面是一个示例：

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

我们欢迎您贡献 Databend 文档，与您的代码一起！Databend 文档由 markdown 文件组成，这使得编写和维护变得容易。为了确保高质量的文档，我们推荐使用 [Visual Studio Code](https://code.visualstudio.com/) 作为您的 markdown 编辑器。此外，安装 [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) 扩展将帮助您捕捉任何拼写错误。

在提交新命令或函数的文档时，遵循提供的模板和指南至关重要，以保持一致性并确保 Databend 文档的清晰度。这些模板旨在包含所有必要的信息和格式约定，使用户更容易理解和使用命令或功能。

- [command-template](https://github.com/datafuselabs/databend/blob/d3a40d91b8a8ebaf878344e024164f36b6db5615/docs/public/templates/command-template.md?plain=1)
- [function-template](https://github.com/datafuselabs/databend/blob/d3a40d91b8a8ebaf878344e024164f36b6db5615/docs/public/templates/function-template.md?plain=1)

除了遵循模板外，请注意其中包含的代码。代码的目的是明确指示新命令或功能是否仅适用于 Databend Enterprise，并提供有关命令或功能引入时间的信息。这种上下文信息对用户至关重要，因为它允许他们准确评估功能的范围和限制。它还使用户能够识别支持该功能的特定 Databend 版本，使他们能够有效地规划他们的使用。

## Pull Requests

### 提交 PR

1. Fork `databend` 仓库并从 `main` 创建您的分支。
2. 打开一个常规 [issue](https://github.com/datafuselabs/databend/issues/new/choose) 来绑定 pull request。
3. 提交一个 [Draft Pull Requests](https://github.blog/2019-02-14-introducing-draft-pull-requests/)，标记您的工作进度。
4. 如果您添加了应该被测试的代码，请添加单元测试。
5. 验证并确保测试套件通过，`make test`。
6. 确保您的代码通过了两个 linters，`make lint`。
7. 将状态更改为“准备好审查”。
8. 注意来自 `@mergify` 的回复，她将是您的向导。

### PR 标题

格式：`<type>(<scope>): <subject>`

`<scope>` 是可选的

```
fix(query): 修复按字符串分组的 bug
^--^  ^------------^
|     |
|     +-> 用现在时态的摘要。
|
+-------> 类型：rfc, feat, fix, refactor, ci, docs, chore
```

更多类型：

- `rfc`：此 PR 提出了一个新的 RFC
- `feat`：此 PR 向代码库引入了一个新功能
- `fix`：此 PR 修复了代码库中的一个 bug
- `refactor`：此 PR 更改了代码库，没有新功能或 bug 修复
- `ci`：此 PR 更改了构建/CI 步骤
- `docs`：此 PR 更改了文档或网站
- `chore`：此 PR 只有小的更改，不需要记录，如编码风格。

### PR 模板

Databend 有一个 [Pull Request 模板](https://github.com/datafuselabs/databend/blob/main/.github/PULL_REQUEST_TEMPLATE.md)：

```shell
我特此同意可在以下链接找到的 CLA 的条款：https://docs.databend.com/dev/policies/cla

## 摘要

关于此 PR 的摘要

修复 #issue
```

您不应更改 PR 模板上下文，但需要完成：

- `摘要` - 描述构成 Pull Request 的内容以及您对代码所做的更改。例如，修复了哪个问题。

## 测试

*单元测试*

```shell
$ make unit-test
```

*无状态测试*

```shell
$ make stateless-test
```

## 问题

Databend 使用 [GitHub issues](https://github.com/datafuselabs/databend/issues) 跟踪 bugs。请包括重现您的问题所需的必要信息和说明。

## 文档

所有开发者文档都发布在 Databend 开发者网站上，[databend.com](/guides)。

## 行为守则

请参考 [行为守则](/dev/policies/code-of-conduct)，其中描述了社区内互动的期望。