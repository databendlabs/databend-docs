# Databend 文档：您的贡献至关重要

[![GitHub stars](https://img.shields.io/github/stars/datafuselabs/databend-docs.svg?style=social&label=Stars)](https://github.com/datafuselabs/databend-docs/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/datafuselabs/databend-docs.svg?style=social&label=Forks)](https://github.com/datafuselabs/databend-docs/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/graphs/contributors)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/pulls)
[![GitHub issues](https://img.shields.io/github/issues/datafuselabs/databend-docs.svg)](https://github.com/datafuselabs/databend-docs/issues)
[![Twitter Follow](https://img.shields.io/twitter/follow/DatabendLabs?style=social)](https://twitter.com/DatabendLabs)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red?style=flat&logo=youtube)](https://www.youtube.com/@DatabendLabs)

欢迎来到 Databend 官方文档仓库！我们邀请您贡献力量，帮助改进 Databend 文档。

## Databend 文档一瞥

Databend 文档经过精心组织，为用户提供结构化和全面的信息资源。通过访问 [https://docs.databend.com/](https://docs.databend.com/) 的文档页面，您会发现关键信息被分类到不同的标签中。每个标签服务于特定的目的，提供关于 Databend 不同方面的详细见解：

| 标签            | 本仓库中的文件夹                                                                                      | 描述                                                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 指南            | [docs/guides](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/guides)                | 包含核心功能、数据导入/导出、第三方工具集成以及所有 Databend 版本的编程接口的见解。此外，还提供有关在本地部署 Databend 的宝贵信息。 |
| Databend Cloud | [docs/guides/cloud](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/guides/20-cloud) | 包含针对 Databend Cloud 的账户注册、操作指南和组织管理的详细信息。无论您是云环境的新手还是经验丰富的用户，都可以在此分享您的见解。 |
| SQL 参考        | [docs/sql-reference](https://github.com/datafuselabs/databend-docs/tree/main/docs/en/sql-reference)  | 解释 Databend 的一般基础知识和各种可用的 SQL 函数和命令。为这一部分贡献内容，帮助其他用户在 Databend 中导航 SQL 世界。                                                   |
| 发布            | -                                                                                                    | 包含 Databend Cloud 的发布说明和夜间构建的更新。                                                                                                                                                             |

## 您可以贡献什么

通过为新开发的功能或命令贡献文档，或改进现有部分，分享您的专业知识。我们也欢迎您指出错误或提出澄清建议。虽然“发布”部分专用于官方更新，但文档的其他部分都欢迎您的见解。

## 如何贡献

为了确保协作过程顺利，我们建议遵循以下最佳实践：

1. 分叉和分支：

- 我们建议在 GitHub 上分叉仓库，并为您的编辑创建一个新分支。这有助于更好的版本控制和更改跟踪。
- 在您的分支上编辑文档，并在准备好审核时提交拉取请求（PR）。

2. 遵循现有格式：为了保持一致性，请遵循现有文档格式。例如，如果您正在为新功能添加文档，请考虑复制同一文件夹中的现有 markdown 文件并相应修改。

3. 本地预览：

- 为了在本地预览您的更改并确保它们符合您的预期，请确保您的机器上安装了 [Node.js](https://nodejs.org/)（**请安装版本大于 20**）。在终端中运行以下命令以启动本地预览：

```bash
yarn install
```

```bash
yarn run dev
```

- 在提交之前，确认格式正确，链接按预期工作，内容符合您的预期。

## 版本控制

Databend 文档网站始终展示产品的最新内容。为了指示特定功能（如命令或函数）的引入或修改时间，请插入如下代码片段：

```markdown
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.34"/>
```

## 需要帮助？

如果您有任何问题或需要支持，请随时通过电子邮件联系：

[![Email](https://img.shields.io/badge/Email-soyeric128%40yahoo.com-blue?style=flat-square&logo=yahoo-mail)](mailto:soyeric128@yahoo.com)

祝您贡献愉快！