---
title: 查询结果缓存
---

- RFC PR: [datafuselabs/databend#10014](https://github.com/databendlabs/databend/pull/10014)
- Tracking Issue: [datafuselabs/databend#10011](https://github.com/databendlabs/databend/issues/10011)

## 概要

支持查询结果缓存，以加快查询响应速度。

## 动机

对于一些数据不经常更改的开销大的查询，我们可以缓存结果以加快查询响应速度。对于具有相同底层数据的相同查询，我们可以直接返回缓存的结果，从而大大提高查询效率。

例如，如果我们想每 10 秒执行以下查询以获取销量排名前 5 的产品：

```sql
SELECT product, count(product) AS sales_count
FROM sales_log
GROUP BY product
ORDER BY sales_count DESC
LIMIT 5;
```

如果我们每次都执行完整的查询流水线，成本可能非常高，但结果非常小（5 行）。由于 `sales_log` 的数据可能不会经常更改，我们可以缓存查询结果，并直接为同一查询返回缓存的结果。

## 详细设计

### 查询结果缓存的生命周期

每个结果缓存都有一个生存时间 (TTL)。每次访问结果缓存都会刷新 TTL。当 TTL 过期时，将不再使用结果缓存。

除了 TTL 之外，当底层数据发生更改时（我们可以通过快照 ID、段 ID 或分区位置推断出这一点），结果缓存也会失效。

### 结果缓存存储

Databend 使用键值对来记录查询结果缓存。对于每个查询，Databend 将构造一个键来表示查询，并将相关信息存储在值中。

Databend 不会将查询结果直接存储在键值存储中。相反，Databend 仅将结果缓存文件的位置存储在值中。实际的结果缓存将存储在存储层（本地 fs、s3 等）中。

#### 键

查询结果缓存由其抽象语法树 (AST) 索引。Databend 将 AST 序列化为字符串，并将其哈希值用作键。

键的生成方式如下：

```rust
let ast_str = ast.to_string();
let key = format!("_cache/{}/{}", tenant, hash(ast_str.as_bytes()));
```

#### 值结构

查询结果缓存值的结构如下：

```rust
pub struct ResultCacheValue {
    /// The query SQL.
    pub sql: String,
    /// The query time.
    pub query_time: DateTime<Utc>,
    /// Time-to-live of this query.
    pub ttl: usize,
    /// The size of the result cache (bytes).
    pub result_size: usize,
    /// The location of the result cache file.
    pub location: String,

    // May be other information
    // ...
}
```

#### 键值存储

`databend-meta` 具有存储和查询键值对的功能。Databend 使用它来存储查询结果缓存键值对。

#### 垃圾回收

如果启用了查询结果缓存，Databend 将缓存每个查询结果。如果结果缓存已过期，将不再使用该缓存。为了节省磁盘或对象存储空间，Databend 需要一个守护线程定期扫描所有查询缓存并删除过期的缓存。

### 相关配置

- `enable_query_result_cache`：是否启用查询结果缓存（默认值：false）。
- `query_result_cache_max_bytes`：单个查询的结果缓存的最大大小（默认值：1048576 字节，1MB）。
- `query_result_cache_ttl_secs`：结果缓存的生存时间（默认值：300 秒）。

### 写入结果缓存

`TransformWriteResultCache` 用于处理查询结果缓存写入：

```rust
pub struct TransformWriteResultCache {
    ctx: Arc<QueryContext>,
    cache_key: String,
    cache_writer: ResultCacheWriter,
}
```

在构造查询流水线时，Databend 会将 `TransformWriteResultCache` 添加到流水线的末尾：

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

`TransformWriteResultCache` 的过程如下：

1. 如果上游已完成，则使用 `cache_writer` 生成结果并将其写入缓存文件。转到 6。
2. 从输入端口读取一个 `DataBlock`。
3. 如果 `cache_writer` 已满（达到 `query_result_cache_max_bytes`），则转到 5（不写入缓存）。
4. 将 `DataBlock` 推入 `cache_writer`。
5. 将 `DataBlock` 输出到输出端口。转到 1。
6. 完成。

### 读取结果缓存

在构造 select interpreter 之前，Databend 将检查查询结果缓存是否可用。

Databend 将首先通过来自 `databend-meta` 的缓存键 (AST) 验证 `ResultCacheValue`。如果结果缓存可用且有效，Databend 将从结果缓存文件中获取查询结果；否则，Databend 将继续构建和执行原始查询流水线。

### 系统表 `system.query_cache`

系统表 `system.query_cache` 用于查找查询结果缓存信息。

该表包含以下信息：

- `sql`：缓存的 SQL。
- `query_time`：上次查询时间。
- `expired_time`：结果缓存的过期时间。
- `result_size`：结果缓存的大小（字节）。
- `location`：结果缓存文件的位置。

### 表函数 `RESULT_SCAN`

`RESULT_SCAN` 是一个有用的表函数，用于检索先前查询的结果集。

它可以像这样使用：

```sql
select * from RESULT_SCAN('<query_id>');
select * from RESULT_SCAN(LAST_QUERY_ID());
```

如果先前的查询结果被缓存，我们可以从查询结果缓存中快速获取结果集。

### 非确定性函数

某些函数是非确定性的，例如 `now()`、`rand()`、`uuid()` 等。如果在查询中使用这些函数，则不会缓存结果。

## 参考文献

- [ClickHouse 中的查询缓存](https://clickhouse.com/docs/en/operations/query-cache/)
- [关于 ClickHouse 中查询缓存的博客](https://clickhouse.com/blog/introduction-to-the-clickhouse-query-cache-and-design)
- [snowflake 中的 RESULT_SCAN](https://docs.snowflake.com/en/sql-reference/functions/result_scan)
- [在 Oracle 中调整结果缓存](https://docs.oracle.com/en/database/oracle/oracle-database/19/tgdba/tuning-result-cache.html)
