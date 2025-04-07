---
title: system.settings
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.466"/>

存储当前会话的系统设置。

```sql
SELECT * FROM system.settings;
```

```
name                                        |value       |default     |level  |description                                                                                                                                                                        |type  |
--------------------------------------------+------------+------------+-------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------+
collation                                   |binary      |binary      |SESSION|设置字符排序规则。可用值包括 "binary" 和 "utf8"。                                                                                                                                       |String|
ddl_column_type_nullable                    |1           |1           |SESSION|如果创建或更改表时，列默认为可空。                                                                                                                                                        |UInt64|
efficiently_memory_group_by                 |0           |0           |SESSION|高效使用内存，但这可能会导致性能下降。                                                                                                                                           |UInt64|
enable_aggregating_index_scan               |1           |1           |SESSION|查询时启用扫描聚合索引数据。                                                                                                                             |UInt64|
enable_bushy_join                           |0           |0           |SESSION|允许优化器生成 bushy join 计划。                                                                                                                           |UInt64|
enable_cbo                                  |1           |1           |SESSION|启用基于成本的优化。                                                                                                                                                   |UInt64|
enable_distributed_compact                  |0           |0           |SESSION|启用表的分布式压缩。                                                                                                                                  |UInt64|
enable_distributed_copy_into                |0           |0           |SESSION|启用 COPY INTO 的分布式执行。                                                                                                                                         |UInt64|
enable_distributed_merge_into               |0           |0           |SESSION|启用分布式 MERGE INTO。                                                                                                                                                     |UInt64|
enable_distributed_recluster                |0           |0           |SESSION|启用表的分布式重新聚类。                                                                                                                                   |UInt64|
enable_distributed_replace_into             |0           |0           |SESSION|启用分布式 REPLACE INTO。                                                                                                                                      |UInt64|
enable_dphyp                                |1           |1           |SESSION|启用 dphyp join 顺序算法。                                                                                                                                                |UInt64|
enable_experimental_merge_into              |0           |0           |SESSION|启用实验性的 MERGE INTO。                                                                                                                                                    |UInt64|
enable_hive_parquet_predict_pushdown        |1           |1           |SESSION|通过将此变量设置为 1 来启用 hive parquet predict pushdown，默认值：1                                                                                              |UInt64|
enable_parquet_page_index                   |1           |1           |SESSION|启用 parquet page index。                                                                                                                                                         |UInt64|
enable_parquet_prewhere                     |0           |0           |SESSION|启用 parquet prewhere。                                                                                                                                                           |UInt64|
enable_parquet_rowgroup_pruning             |1           |1           |SESSION|启用 parquet rowgroup pruning。                                                                                                                                                   |UInt64|
enable_query_profiling                      |0           |0           |SESSION|启用查询 profile 记录。                                                                                                                                                    |UInt64|
enable_query_result_cache                   |0           |0           |SESSION|启用缓存查询结果以提高相同查询的性能。                                                                                                        |UInt64|
enable_recluster_after_write                |1           |1           |SESSION|启用写入后重新聚类（copy/replace-into）。                                                                                                                              |UInt64|
enable_refresh_aggregating_index_after_write|0           |0           |SESSION|写入新数据后刷新聚合索引。                                                                                                                                   |UInt64|
enable_replace_into_bloom_pruning           |1           |1           |SESSION|为 replace-into 语句启用 bloom pruning。                                                                                                                                  |UInt64|
enable_replace_into_partitioning            |1           |1           |SESSION|为 replace-into 语句启用分区（如果表有 cluster keys）。                                                                                                       |UInt64|
enable_runtime_filter                       |0           |0           |SESSION|为 JOIN 启用运行时过滤优化。                                                                                                                                      |UInt64|
enable_table_lock                           |1           |1           |SESSION|如果需要，启用表锁（默认启用）。                                                                                                                              |UInt64|
flight_client_timeout                       |60          |60          |SESSION|设置 flight client 请求可以处理的最长时间（秒）。                                                                                                    |UInt64|
group_by_shuffle_mode                       |before_merge|before_merge|SESSION|Group by shuffle 模式，'before_partial' 更加平衡，但需要交换更多数据。                                                                                         |String|
group_by_two_level_threshold                |20000       |20000       |SESSION|设置 GROUP BY 操作中将触发两级聚合的键的数量。                                                                                                                        |UInt64|
hide_options_in_show_create_table           |1           |1           |SESSION|隐藏表相关信息，例如 SNAPSHOT_LOCATION 和 STORAGE_FORMAT，在 SHOW TABLE CREATE 结果的末尾。                                                     |UInt64|
hive_parquet_chunk_size                     |16384       |16384       |SESSION|每次从 parquet 读取到 Databend 处理器的最大行数。                                                                                                                |UInt64|
input_read_buffer_size                      |4194304     |4194304     |SESSION|设置分配给缓冲读取器用于从存储读取数据的缓冲区的内存大小（以字节为单位）。                                                                       |UInt64|
join_spilling_threshold                     |0           |0           |SESSION|Hash join 可以使用的最大内存量，0 表示无限制。                                                                                                                    |UInt64|
lazy_read_threshold                         |1000        |1000        |SESSION|设置查询中启用延迟读取优化的最大 LIMIT。将其设置为 0 将禁用优化。                                                                     |UInt64|
load_file_metadata_expire_hours             |12          |12          |SESSION|设置使用 COPY INTO 从中加载数据的文件的元数据过期的时长（小时）。                                                                                        |UInt64|
max_block_size                              |65536       |65536       |SESSION|设置可以读取的单个数据块的最大字节大小。                                                                                                                |UInt64|
max_execute_time_in_seconds                 |0           |0           |SESSION|设置最大查询执行时间（秒）。将其设置为 0 表示没有限制。                                                                                                  |UInt64|
max_inlist_to_or                            |3           |3           |SESSION|设置可以包含在 IN 表达式中以转换为 OR 运算符的最大值数量。                                                                      |UInt64|
max_memory_usage                            |6871947673  |6871947673  |SESSION|设置处理单个查询的最大内存使用量（以字节为单位）。                                                                                                              |UInt64|
max_result_rows                             |0           |0           |SESSION|设置在未指定特定行数时，查询结果中可以返回的最大行数。将其设置为 0 表示没有限制。                                    |UInt64|
max_storage_io_requests                     |48          |48          |SESSION|设置最大并发 I/O 请求数。                                                                                                                                |UInt64|
max_threads                                 |8           |8           |SESSION|设置执行请求的最大线程数。                                                                                                                           |UInt64|
numeric_cast_option                         |rounding    |rounding    |SESSION|将数字转换模式设置为 "rounding" 或 "truncating"。                                                                                                                               |String|
parquet_fast_read_bytes                     |0           |0           |SESSION|较小的 Parquet 文件将被作为整个文件读取，而不是逐列读取。                                                                                          |UInt64|
parquet_uncompressed_buffer_size            |2097152     |2097152     |SESSION|设置用于读取 Parquet 文件的缓冲区大小（以字节为单位）。                                                                                                                   |UInt64|
prefer_broadcast_join                       |1           |1           |SESSION|启用 broadcast join。                                                                                                                                                            |UInt64|
query_result_cache_allow_inconsistent       |0           |0           |SESSION|确定 Databend 是否将返回与底层数据不一致的缓存查询结果。                                                                       |UInt64|
query_result_cache_max_bytes                |1048576     |1048576     |SESSION|设置单个查询结果的缓存最大字节大小。                                                                                                                     |UInt64|
query_result_cache_ttl_secs                 |300         |300         |SESSION|设置缓存查询结果的生存时间 (TTL)，以秒为单位。一旦缓存结果的 TTL 过期，该结果将被视为陈旧，将不会用于新查询。|UInt64|
quoted_ident_case_sensitive                 |1           |1           |SESSION|确定 Databend 是否将带引号的标识符视为区分大小写。                                                                                                           |UInt64|
recluster_block_size                        |2405181685  |2405181685  |SESSION|设置重新聚类的最大块字节大小。                                                                                                                                 |UInt64|
recluster_timeout_secs                      |43200       |43200       |SESSION|设置重新聚类最终完成的超时时间（秒）。                                                                                                                             |UInt64|
replace_into_bloom_pruning_max_column_number|4           |4           |SESSION|Bloom pruning 用于 replace-into 语句的最大列数。                                                                                                            |UInt64|
replace_into_shuffle_strategy               |0           |0           |SESSION|0 表示块级别 shuffle，1 表示段级别 shuffle。                                                                                                                             |UInt64|
retention_period                            |12          |12          |SESSION|设置保留期限（小时）。                                                                                                                                                |UInt64|
sandbox_tenant                              |            |            |SESSION|将自定义 'sandbox_tenant' 注入到此会话中。这仅用于测试目的，并且仅当启用 'internal_enable_sandbox_tenant' 时才生效。               |String|
spilling_bytes_threshold_per_proc           |0           |0           |SESSION|设置在查询执行期间，聚合器在将数据溢出到存储之前可以使用的最大内存量（以字节为单位）。                                                      |UInt64|
spilling_memory_ratio                       |0           |0           |SESSION|设置在查询执行期间，聚合器在将数据溢出到存储之前可以使用的最大内存比率（以字节为单位）。                                                          |UInt64|
sql_dialect                                 |PostgreSQL  |PostgreSQL  |SESSION|设置 SQL 方言。可用值包括 "PostgreSQL"、"MySQL" 和 "Hive"。                                                                                                  |String|
storage_fetch_part_num                      |2           |2           |SESSION|设置在查询执行期间，从存储并行获取的分区数。                                                                                    |UInt64|
storage_io_max_page_bytes_for_read          |524288      |524288      |SESSION|设置可以在单个 I/O 操作中从存储读取的数据页面的最大字节大小。                                                                                  |UInt64|
storage_io_min_bytes_for_seek               |48          |48          |SESSION|设置在数据文件中查找新位置时，必须在单个 I/O 操作中从存储读取的最小数据字节大小。                                          |UInt64|
storage_read_buffer_size                    |1048576     |1048576     |SESSION|设置用于将数据读入内存的缓冲区大小（以字节为单位）。                                                                                                                |UInt64|
table_lock_expire_secs                      |5           |5           |SESSION|设置表锁过期的秒数。                                                                                                                               |UInt64|
timezone                                    |Japan       |UTC         |GLOBAL |设置时区。                                                                                                                                                                 |String|
unquoted_ident_case_sensitive               |0           |0           |SESSION|确定 Databend 是否将未带引号的标识符视为区分大小写。                                                                                                         |UInt64|
use_parquet2                                |1           |1           |SESSION|当 infer_schema() 时，使用 parquet2 而不是 parquet_rs。                                                                                                                            |UInt64|
```