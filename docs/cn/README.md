# Databend 文档：您的贡献很重要

[![GitHub stars](https://img.shields.io/github/stars/datafuselabs/databend-docs.svg?style=social&label=Stars)](https://github.com/datafuselabs/databend-docs/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/datafuselabs/databend-docs.svg?style=social&label=Forks)](https://github.com/datafuselabs/databend-docs/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/graphs/contributors)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/pulls)
[![GitHub issues](https://img.shields.io/github/issues/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/issues)
[![Twitter Follow](https://img.shields.io/twitter/follow/DatabendLabs?style=social)](https://x.com/DatabendLabs)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red?style=flat&logo=youtube)](https://www.youtube.com/@DatabendLabs)

欢迎来到 Databend 官方文档仓库！我们邀请您贡献并帮助改进 Databend 文档。

## Databend 文档概览

Databend 文档经过精心组织，为用户提供结构化和全面的资源。在 [https://docs.databend.com/](https://docs.databend.com/) 的文档页面中，您会发现关键信息被分类到不同的标签页中。每个标签页都有特定的用途，提供有关 Databend 不同方面的详细见解：

| 标签            | 本仓库中的文件夹                                                                                  | 描述                                                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 指南         | [docs/guides](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/guides)                | 包括对核心功能、数据导入/导出、第三方工具集成以及所有 Databend 版本的编程接口的见解。此外，还提供了有关在本地部署 Databend 的宝贵信息。 |
| Databend Cloud | [docs/guides/cloud](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/guides/20-cloud) | 包括针对 Databend Cloud 的账户注册、操作指南和组织管理的详细信息。无论您是云环境的新手还是经验丰富的用户，都可以在此处贡献您的见解。 |
| SQL 参考  | [docs/sql-reference](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/sql-reference)  | 解释 Databend 的一般要点以及各种可用的 SQL 函数和命令。贡献此部分以帮助其他用户了解 Databend 中的 SQL 世界。                                                   |
| 发布       | -                                                                                                    | 包含 Databend Cloud 的发布说明和 nightly 版本的更新。                                                                                                                                                             |

## 您可以贡献什么

通过贡献您开发的新功能或命令的文档，甚至改进现有部分，分享您的专业知识。我们也欢迎您发现错误或提出澄清建议。虽然“发布”部分专用于官方更新，但文档的其他部分都开放供您贡献见解。

## 如何贡献

为了确保协作过程顺利进行，我们建议遵循以下最佳实践：

1. Fork 和分支：

- 我们建议在 GitHub 上 fork 仓库，并为您的编辑创建一个新分支。这样可以更好地进行版本控制，并更容易跟踪更改。
- 在您的分支上编辑文档，并在准备好审查时提交 Pull Request (PR)。

2. 遵循现有格式：为了保持一致性，请遵循现有的文档格式。例如，如果您要添加新功能的文档，请考虑从同一文件夹中复制现有的 markdown 文件并进行相应的修改。

3. 本地预览：

- 为了在本地预览您的更改并确保它们符合您的期望，请确保您的机器上安装了 [Node.js](https://nodejs.org/)（**请安装大于 20 的版本**）。在终端中运行以下命令以启动本地预览：

**如果您的机器上有多个 Node.js 版本，我们建议使用 [nvm](https://github.com/nvm-sh/nvm) 来管理您的 Node 版本。**

```bash
yarn install
```

```bash
yarn run dev
```

- 在提交之前，请确认格式正确，链接按预期工作，并且内容符合您的预期。

## 版本控制

Databend 文档网站始终展示产品的最新内容。为了指示特定功能（如命令或函数）的引入或修改时间，请插入如下代码片段：

```markdown
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.34"/>
```

## 需要帮助？

如果您有任何问题或需要支持，请随时通过电子邮件联系我们：

[![Email](https://img.shields.io/badge/Email-soyeric128%40yahoo.com-blue?style=flat-square&logo=yahoo-mail)](mailto:soyeric128@yahoo.com)

祝您贡献愉快！