---
title: 从文件加载数据
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 提供了多种工具和命令，可以帮助您将数据文件加载到表中。它们中的大多数都很直接，这意味着您可以仅通过一个命令加载数据。请注意，您的数据文件必须是 Databend 支持的格式之一。请参阅[输入和输出文件格式](/sql/sql-reference/file-format-options)以获取支持的文件格式列表。以下是数据加载和卸载流程及其相应方法的概述。请参阅本章中的主题以获取详细说明。

![Alt text](@site/docs/public/img/load/load-unload.jpeg)

本主题并未涵盖所有可用的数据加载方法，但它根据您的数据文件存储位置提供了建议。要找到推荐的方法和链接到相应详细信息页面，请切换下面的块：

<DetailsWrap>

<details>
  <summary>我想加载暂存的数据文件...</summary>
  <div>
    <div>如果您在内部/外部暂存区或用户暂存区中有数据文件，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速高效地加载大量数据。</div>
    <br/>
    <div>要了解更多关于使用 COPY INTO 命令从暂存区加载数据的信息，请查看<a href="stage">从暂存区加载</a>页面。该页面包括详细的教程，向您展示如何使用该命令从内部/外部暂存区或用户暂存区中的示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载存储桶中的数据文件...</summary>
  <div>
    <div>如果您在对象存储上的存储桶或容器中有数据文件，例如 Amazon S3、Google Cloud Storage 和 Microsoft Azure，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速高效地加载大量数据。</div>
    <br/>
    <div>要了解更多关于使用 COPY INTO 命令从存储桶或容器加载数据的信息，请查看<a href="s3">从存储桶加载</a>页面。该页面包括一个教程，向您展示如何使用该命令从 Amazon S3 存储桶中的示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载本地数据文件...</summary>
  <div>
    <div>如果您在本地系统中有数据文件，Databend 建议您使用<a href="https://github.com/datafuselabs/BendSQL">BendSQL</a>，Databend 的原生 CLI 工具，允许您与 Databend 建立连接并直接从 CLI 窗口执行查询。</div>
    <br/>
    <div>要了解更多关于使用 BendSQL 加载本地数据文件的信息，请查看<a href="local">从本地文件加载</a>页面。该页面包括教程，向您展示如何使用该工具从本地示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载远程数据文件...</summary>
  <div>
    <div>如果您有远程数据文件，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速高效地加载大量数据。</div>
    <br/>
    <div>要了解更多关于使用 COPY INTO 命令加载远程数据文件的信息，请查看<a href="http">从远程文件加载</a>页面。该页面包括一个教程，向您展示如何使用该命令从远程示例文件加载数据。</div>
  </div>
</details>

</DetailsWrap>