---
title: Databend 发布通道
sidebar_label: Databend 发布通道
sidebar_position: 3
description:
  什么是 Databend 发布通道？
---

Databend 发布过程遵循 `release train` 模型，该模型被 Rust、Firefox 和 Chrome 等使用，以及 `feature staging`。

:::tip
在早期阶段，Databend 只会升级 nightly 版本号，当 nightly 版本准备好进行 beta 测试时，我们会留下一个脱离 nightly 版本的 beta 版本。
:::

好的，让我们从了解 Databend 如何进行发布开始。
以下内容主要来自 Rust 文档 [How Rust is Made and “Nightly Rust”](https://github.com/rust-lang/book/blob/main/src/appendix-07-nightly-rust.md)。

Databend 有三个发布通道（这与 Rust 相同）：
- Nightly
- Beta
- Stable

随着时间的推移，我们的发布看起来像这样，每天一次：
```
nightly: * - - * - - *
```

每六周，就到了准备新版本的时候了！ Databend 仓库的 beta 分支从 nightly 使用的 main 分支分叉出来。现在，有两个版本：
```
nightly: * - - * - - *
                     |
beta:                *
```

在创建第一个 beta 版本六周后，就到了发布 stable 版本的时候了！ stable 分支由 beta 分支产生：
```
nightly: * - - * - - * - - * - - * - - * - * - *
                     |
beta:                * - - - - - - - - *
                                       |
stable:                                *
```

这被称为 `train model`，因为每六周，一个版本都会 `离开车站`，但在作为 stable 版本到达之前，仍然需要经过 beta 通道的旅程。