---
title: 查询结果缓存
---

- RFC PR: [datafuselabs/databend#10014](https://github.com/datafuselabs/databend/pull/10014)
- 跟踪问题: [datafuselabs/databend#10011](https://github.com/datafuselabs/databend/issues/10011)

## 摘要

支持查询结果缓存以加快查询响应速度。

## 动机

对于一些数据不经常变化的昂贵查询，我们可以缓存结果以加快查询响应。对于相同的查询和相同的底层数据，我们可以直接返回缓存的结果，这大大提高了查询效率。

例如，如果我们想要执行以下查询，每10秒获取销量前5的产品：

```sql
SELECT product, count(product) AS sales_count
FROM sales_log
GROUP BY product
ORDER BY sales_count DESC
LIMIT 5;
```

如果我们每次都执行完整的查询流程，成本可能非常昂贵，但结果非常小（5行）。由于`sales_log`的数据可能不会频繁变化，我们可以缓存查询结果，并对相同的查询直接返回缓存的结果。

## 详细设计

### 查询结果缓存的生命周期

每个结果缓存都有一个生存时间（TTL）。每次访问结果缓存都会刷新TTL。当TTL过期时，结果缓存将不再被使用。

除了TTL外，当底层数据发生变化时（我们可以通过快照ID、段ID或分区位置推断出来），结果缓存也会被无效化。

### 结果缓存存储

Databend使用键值对来记录查询结果缓存。对于每个查询，Databend将构造一个键来代表查询，并在值中存储相关信息。

Databend不会直接在键值存储中存储查询结果。相反，Databend只在值中存储结果缓存文件的位置。实际的结果缓存将存储在存储层（本地fs、s3等）。

#### 键

查询结果缓存由其抽象语法树（AST）索引。Databend将AST序列化为字符串并将其哈希化作为键。

键的生成方式如下：

```rust
let ast_str = ast.to_string();
let key = format!("_cache/{}/{}", tenant, hash(ast_str.as_bytes()));
```

#### 值结构

查询结果缓存值的结构如下：

```rust
pub struct ResultCacheValue {
    /// 查询SQL。
    pub sql: String,
    /// 查询时间。
    pub query_time: DateTime<Utc>,
    /// 此查询的生存时间。
    pub ttl: usize,
    /// 结果缓存的大小（字节）。
    pub result_size: usize,
    /// 结果缓存文件的位置。
    pub location: String,

    // 可能还有其他信息
    // ...
}
```

#### 键值存储

`databend-meta`具有存储和查询键值对的能力。Databend使用它来存储查询结果缓存键值对。

#### 垃圾回收

如果启用了查询结果缓存，Databend将缓存每个查询结果。如果结果缓存过期，缓存将不再被使用。为了节省磁盘或对象存储空间，Databend需要一个守护线程定期扫描所有查询缓存并移除过期的缓存。

### 相关配置

- `enable_query_result_cache`：是否启用查询结果缓存（默认：false）。
- `query_result_cache_max_bytes`：单个查询的结果缓存的最大大小（默认：1048576字节，1MB）。
- `query_result_cache_ttl_secs`：结果缓存的生存时间（默认：300秒）。

### 写入结果缓存

`TransformWriteResultCache`用于处理查询结果缓存的写入：

```rust
pub struct TransformWriteResultCache {
    ctx: Arc<QueryContext>,
    cache_key: String,
    cache_writer: ResultCacheWriter,
}
```

在构建查询流程时，Databend将`TransformWriteResultCache`添加到流程的末尾：

```rust
impl Interpreter for SelectInterpreterV2 {
    async fn execute2(&self) -> Result<PipelineBuildResult> {
        let build_res = self.build_pipeline().await?;
        if self.ctx.get_settings().get_query_result_cache().enable_query_result_cache {
            build_res.main_pipeline.add_transform(TransformWriteResultCache::try_create)?;
        }
        Ok(build_res)
    }
}
```

`TransformWriteResultCache`的处理过程如下：

1. 如果上游完成，使用`cache_writer`生成并将结果写入缓存文件。转到6。
2. 从输入端口读取一个`DataBlock`。
3. 如果`cache_writer`已满（达到`query_result_cache_max_bytes`），转到5（不写入缓存）。
4. 将`DataBlock`推入`cache_writer`。
5. 将`DataBlock`输出到输出端口。转到1。
6. 完成。

### 读取结果缓存

在构建选择解释器之前，Databend将检查查询结果缓存是否可用。

Databend首先从`databend-meta`验证`ResultCacheValue`的缓存键（AST）。如果结果缓存可用且有效，Databend将从结果缓存文件获取查询结果；否则，Databend将继续构建并执行原始查询流程。

### 系统表`system.query_cache`

系统表`system.query.cache`用于查找查询结果缓存信息。

该表包含如下信息：

- `sql`：缓存的SQL。
- `query_time`：最后一次查询时间。
- `expired_time`：结果缓存的过期时间。
- `result_size`：结果缓存的大小（字节）。
- `location`：结果缓存文件的位置。

### 表函数`RESULT_SCAN`

`RESULT_SCAN`是一个有用的表函数，用于检索之前查询的结果集。

它可以像这样使用：

```sql
select * from RESULT_SCAN('<query_id>');
select * from RESULT_SCAN(LAST_QUERY_ID());
```

如果之前的查询结果被缓存，我们可以从查询结果缓存中快速获取结果集。

### 非确定性函数

一些函数是非确定性的，例如`now()`、`rand()`、`uuid()`等。如果在查询中使用了这些函数，结果将不会被缓存。

## 参考

- [ClickHouse中的查询缓存](https://clickhouse.com/docs/en/operations/query-cache/)
- [关于ClickHouse查询缓存的博客](https://clickhouse.com/blog/introduction-to-the-clickhouse-query-cache-and-design)
- [snowflake中的RESULT_SCAN](https://docs.snowflake.com/en/sql-reference/functions/result_scan)
- [Oracle中的结果缓存调优](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgdba/tuning-result-cache.html)