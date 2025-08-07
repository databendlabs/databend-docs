# Databend 文档：您的贡献至关重要

[![GitHub stars](https://img.shields.io/github/stars/datafuselabs/databend-docs.svg?style=social&label=Stars)](https://github.com/databendlabs/databend-docs/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/datafuselabs/databend-docs.svg?style=social&label=Forks)](https://github.com/databendlabs/databend-docs/network/members)
[![GitHub contributors](https://img.shields.io/github/contributors/datafuselabs/databend-docs.svg)](https://github.com/databendlabs/databend-docs/graphs/contributors)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/datafuselabs/databend-docs.svg)](https://github.com/databendlabs/databend-docs/pulls)
[![GitHub issues](https://img.shields.io/github/issues/datafuselabs/databend-docs.svg)](https://github.com/databendlabs/databend-docs/issues)
[![Twitter Follow](https://img.shields.io/twitter/follow/DatabendLabs?style=social)](https://x.com/DatabendLabs)
[![YouTube Channel](https://img.shields.io/badge/YouTube-Subscribe-red?style=flat&logo=youtube)](https://www.youtube.com/@DatabendLabs)

欢迎来到 Databend 官方文档仓库！诚邀您贡献智慧，共同完善 Databend 文档。

## Databend 文档速览

Databend 文档经过精心编排，为用户提供结构化且全面的资源。访问 [https://docs.databend.cn/](https://docs.databend.cn/guides) 后，您会看到关键信息被分门别类地置于不同标签页。每个标签页聚焦特定主题，深入介绍 Databend 的各个方面：

| 标签页         | 本仓库对应文件夹                                                                                     | 描述                                                                                                                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Guides         | [docs/guides](https://github.com/databendlabs/databend-docs/tree/main/docs/en/guides)                | 涵盖所有 Databend 版本的核心功能、数据导入/导出、第三方工具集成及编程接口，并包含本地部署 Databend 的实用指南。                                                                                                   |
| Databend Cloud | [docs/guides/cloud](https://github.com/databendlabs/databend-docs/tree/main/docs/en/guides/20-cloud) | 专为 Databend Cloud 提供账户注册、操作指引及组织管理的详细说明。无论您是云环境新手还是资深用户，都欢迎在此分享见解。                                                                                           |
| SQL Reference  | [docs/sql-reference](https://github.com/databendlabs/databend-docs/tree/main/docs/en/sql-reference)  | 详解 Databend 通用要点及丰富的 SQL 函数与命令。贡献此部分，助其他用户轻松驾驭 Databend 的 SQL 世界。                                                                                                          |
| Releases       | -                                                                                                    | 发布 Databend Cloud 的更新日志与 nightly 构建动态。                                                                                                                                                                          |

## 可贡献内容

欢迎为新开发的函数或命令撰写文档，也可优化现有章节。若发现错误或需澄清之处，同样期待您的反馈。除 “Releases” 章节仅用于官方更新外，其余部分均开放供您贡献真知灼见。

## 如何贡献

为确保协作顺畅，请遵循以下最佳实践：

1. Fork 与分支：

- 建议在 GitHub fork 本仓库，并新建分支进行修改，以便更好地进行版本控制与变更追踪。
- 在分支上完成编辑后，提交 Pull Request（PR）以供审核。

2. 遵循现有格式：为保持一致，请沿用当前文档格式。例如，新增函数文档时，可复制同目录下的现有 Markdown 文件并据此调整。

3. 本地预览：

- 本地预览前，请确保已安装 [Node.js](https://nodejs.org/)（**版本须高于 20**）。在终端执行以下命令启动本地预览：

**若本机存在多个 Node.js 版本，建议使用 [nvm](https://github.com/nvm-sh/nvm) 进行管理。**

```bash
yarn
```

```bash
yarn run dev
```

- 提交前，请确认格式无误、链接有效，且内容符合预期。

## 版本标识

Databend 文档网站始终展示产品最新内容。如需标明某功能（如命令或函数）的引入或变更版本，请插入如下代码片段：

```markdown
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.34"/>
```

## 需要帮助？

如有疑问或需支持，请随时邮件联系：

[![Email](https://img.shields.io/badge/Email-hi%40databend.com-blue?style=flat-square)](mailto:hi@databend.com)

贡献愉快！

> [!IMPORTANT]  
> **贡献者重要须知**  
> 若删除文档，**必须**提供旧 URL 与新 URL 以配置 301 重定向，确保导航正常。此外，请通知 @Chasen-Zhang 该变更，或直接修改 [site-redirects.ts](https://github.com/databendlabs/databend-docs/blob/main/site-redirects.ts) 中的重定向配置。否则可能导致用户访问中断。