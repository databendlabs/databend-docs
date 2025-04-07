---
title: 从文件加载
---

import DetailsWrap from '@site/src/components/DetailsWrap';

Databend 提供了多种工具和命令，可以帮助您将数据文件加载到表中。它们中的大多数都很简单，这意味着您只需一个命令即可加载数据。请注意，您的数据文件必须是 Databend 支持的格式之一。有关支持的文件格式的列表，请参见 [输入 & 输出文件格式](/sql/sql-reference/file-format-options)。以下是数据加载和卸载流程及其各自方法的概述。有关详细说明，请参阅本章中的主题。

![Alt text](/img/load/load-unload.jpeg)

本主题未涵盖所有可用的数据加载方法，但它根据数据文件的存储位置提供了建议。要查找推荐的方法以及指向相应详细信息页面的链接，请切换下面的块：

<DetailsWrap>

<details>
  <summary>我想加载暂存的数据文件 ...</summary>
  <div>
    <div>如果您的数据文件位于内部/外部 Stage 或用户 Stage 中，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速有效地加载大量数据。</div>
    <br/>
    <div>要了解有关使用 COPY INTO 命令从 Stage 加载数据的更多信息，请查看 <a href="stage">从 Stage 加载</a> 页面。此页面包含详细的教程，向您展示如何使用该命令从内部/外部 Stage 或用户 Stage 中的示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载存储桶中的数据文件 ...</summary>
  <div>
    <div>如果您的数据文件位于对象存储（如 Amazon S3、Google Cloud Storage 和 Microsoft Azure）上的存储桶或容器中，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速有效地加载大量数据。</div>
    <br/>
    <div>要了解有关使用 COPY INTO 命令从存储桶或容器加载数据的更多信息，请查看 <a href="s3">从存储桶加载</a> 页面。此页面包含一个教程，向您展示如何使用该命令从 Amazon S3 存储桶中的示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载本地数据文件 ...</summary>
  <div>
    <div>如果您的数据文件位于本地系统中，Databend 建议您使用 <a href="https://github.com/databendlabs/BendSQL">BendSQL</a>（Databend 原生 CLI 工具）加载它们，该工具允许您建立与 Databend 的连接并直接从 CLI 窗口执行查询。</div>
    <br/>
    <div>要了解有关使用 BendSQL 加载本地数据文件的更多信息，请查看 <a href="local">从本地文件加载</a> 页面。此页面包含教程，向您展示如何使用该工具从本地示例文件加载数据。</div>
  </div>
</details>

<details>
  <summary>我想加载远程数据文件 ...</summary>
  <div>
    <div>如果您的数据文件是远程数据文件，Databend 建议您使用 COPY INTO 命令加载它们。COPY INTO 命令是一个强大的工具，可以快速有效地加载大量数据。</div>
    <br/>
    <div>要了解有关使用 COPY INTO 命令加载远程数据文件的更多信息，请查看 <a href="http">从远程文件加载</a> 页面。此页面包含一个教程，向您展示如何使用该命令从远程示例文件加载数据。</div>
  </div>
</details>

</DetailsWrap>
