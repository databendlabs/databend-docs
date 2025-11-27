---
title: 数据匿名化函数
---

数据匿名化（Data Anonymization）是指修改或移除数据集中的个人身份信息（PII）以保护隐私的过程。其核心目标是在消除数据与特定个人关联的同时，最大限度地保留数据的分析、研究和测试价值。

### 常见脱敏数据类别

为了符合 GDPR 或 CCPA 等法规要求，组织通常需要对以下几类敏感数据进行脱敏处理：

*   **直接标识符 (Direct Identifiers)**：能够直接识别个人身份的数据，例如全名、电子邮箱、电话号码、身份证号或社保号。
*   **准标识符 (Quasi-Identifiers)**：虽然单一属性无法直接识别个人，但组合后可能暴露身份的属性，例如出生日期、性别、邮政编码或职位。
*   **敏感业务数据**：需要在非生产环境中保护的机密信息，例如交易金额、薪资详情、内部项目名称或知识产权数据。

### Databend 匿名化技术

Databend 提供了一系列函数来支持多种匿名化技术，涵盖数据脱敏、假名化处理以及合成数据生成：

- **数据脱敏 (Data Masking)**：使用 [`OBFUSCATE` 表函数](../17-table-functions/obfuscate.md) 自动对列应用脱敏规则，用格式逼真但无实际关联的合成数据替换原始值。
- **假名化 (Pseudonymization)**：使用 [FEISTEL_OBFUSCATE](feistel_obfuscate.md) 将标识符替换为确定性的混淆值。该方法保留了数据的基数（Cardinality）和位宽，非常适合处理需要进行关联查询（Join）的键值字段。
- **合成数据 (Synthetic Data)**：结合使用 [MARKOV_TRAIN](../07-aggregate-functions/aggregate-markov-train.md) 和 [MARKOV_GENERATE](markov_generate.md) 生成机器合成数据。这些数据在统计特征上与原始数据集相似，但与真实记录没有任何直接联系。

| 函数 | 描述 |
|----------|-------------|
| [MARKOV_GENERATE](markov_generate.md) | 基于马尔可夫模型生成匿名化数据 |
| [FEISTEL_OBFUSCATE](feistel_obfuscate.md) | 对数值类型进行匿名化处理 |
