---
title: system.settings
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.745"/>

存储当前会话的系统设置。

```sql
SELECT * FROM system.settings;
```

| 名称 | 值 | 默认值 | 级别 | 描述 | 类型 |
|------|-----|--------|------|------|------|
| acquire_lock_timeout | 30 | 30 | DEFAULT | 设置获取锁的最大超时时间（秒）。 | UInt64 |
| aggregate_spilling_memory_ratio | 60 | 60 | LOCAL | 设置聚合器在查询执行期间将数据溢出到存储之前可使用的最大内存比率。 | UInt64 |
| allow_query_exceeded_limit | 0 | 0 | DEFAULT | 允许查询短暂超出配置的内存限制，延迟错误通知直到实际发生内存争用。 | UInt64 |
| auto_compaction_imperfect_blocks_threshold | 25 | 25 | GLOBAL | 触发写后自动压缩的阈值。写操作后快照中不完整块数量超过此值时触发。设置为 0 可禁用自动压缩。 | UInt64 |
| auto_compaction_segments_limit | 3 | 3 | DEFAULT | 写操作后自动触发重新聚簇的最大段数量。 | UInt64 |
| binary_input_format | utf-8 | utf-8 | DEFAULT | 控制字符串字面量插入 BINARY 列时的解释方式（HEX、BASE64、UTF-8 或 UTF-8-LOSSY）。 | String |
| binary_output_format | hex | hex | DEFAULT | 控制 BINARY 列的渲染方式（HEX、BASE64、UTF-8 或 UTF-8-LOSSY）。 | String |
| bloom_runtime_filter_threshold | 3000000 | 3000000 | DEFAULT | 设置布隆运行时过滤器生成的最大行数。 | UInt64 |
| collation | utf8 | utf8 | DEFAULT | 设置字符排序规则。可选值包括 "utf8"。 | String |
| compact_max_block_selection | 1000 | 1000 | DEFAULT | 限制压缩操作期间可选择的最大不完整块数量。 | UInt64 |
| copy_dedup_full_path_by_default | 0 | 0 | DEFAULT | 创建表时未设置 copy_dedup_full_path 选项时的默认值。 | UInt64 |
| cost_factor_aggregate_per_row | 5 | 5 | DEFAULT | 每行数据分组操作的代价因子。 | UInt64 |
| cost_factor_hash_table_per_row | 10 | 10 | DEFAULT | 每行数据构建哈希表的代价因子。 | UInt64 |
| cost_factor_network_per_row | 50 | 50 | DEFAULT | 每行数据通过网络传输的代价因子。 | UInt64 |
| create_query_flight_client_with_current_rt | 1 | 1 | DEFAULT | 开启（1）或关闭（0）查询操作使用当前运行时。 | UInt64 |
| data_retention_num_snapshots_to_keep | 0 | 0 | DEFAULT | 指定 VACUUM 操作期间保留的快照数量，覆盖 data_retention_time_in_days。设置为 0 则忽略此设置。 | UInt64 |
| data_retention_time_in_days | 1 | 1 | DEFAULT | 设置数据保留时间（天）。 | UInt64 |
| date_format_style | Oracle | Oracle | DEFAULT | 设置日期时间函数的日期格式样式。可选值："MySQL"、"Oracle"。 | String |
| ddl_column_type_nullable | 1 | 1 | DEFAULT | 在创建或修改表时，新列是否默认为可空（1）或非空（0）。 | UInt64 |
| default_order_by_null | nulls_last | nulls_last | DEFAULT | 控制 ORDER BY 未显式指定时 NULL 值的位置。可选值："nulls_first"、"nulls_last"、"nulls_first_on_asc_last_on_desc"。 | String |
| disable_join_reorder | 0 | 0 | DEFAULT | 禁用连接重排序优化。 | UInt64 |
| disable_variant_check | 0 | 0 | DEFAULT | 禁用 variant 检查以允许插入无效 JSON 值。 | UInt64 |
| dynamic_sample_time_budget_ms | 0 | 0 | DEFAULT | 动态采样的时间预算（毫秒）。 | UInt64 |
| enable_aggregating_index_scan | 1 | 1 | DEFAULT | 在查询时启用对聚合索引数据的扫描。 | UInt64 |
| enable_analyze_histogram | 0 | 0 | DEFAULT | 在分析表期间为查询优化启用直方图分析。 | UInt64 |
| enable_auto_analyze | 1 | 1 | DEFAULT | 启用写后自动分析。0 为禁用，1 为启用。 | UInt64 |
| enable_auto_detect_datetime_format | 0 | 0 | DEFAULT | 启用非 ISO 日期时间格式的自动检测。适用于函数、COPY 和 VARIANT 转换。 | UInt64 |
| enable_auto_fix_missing_bloom_index | 0 | 0 | DEFAULT | 启用自动修复缺失的布隆索引。 | UInt64 |
| enable_auto_materialize_cte | 1 | 1 | DEFAULT | 启用自动物化 CTE。0 为禁用，1 为启用。 | UInt64 |
| enable_auto_vacuum | 0 | 0 | DEFAULT | 是否自动触发表的 VACUUM 操作。 | UInt64 |
| enable_backpressure_spiller | 0 | 0 | DEFAULT | 使用新的背压溢出器。 | UInt64 |
| enable_block_stream_write | 1 | 1 | GLOBAL | 启用块流写入。 | UInt64 |
| enable_bloom_runtime_filter | 1 | 1 | DEFAULT | 为 JOIN 启用布隆运行时过滤器优化。 | UInt64 |
| enable_cbo | 1 | 1 | DEFAULT | 启用基于成本的优化（CBO）。 | UInt64 |
| enable_compact_after_multi_table_insert | 0 | 0 | DEFAULT | 启用多表插入后的重新聚簇和压缩。 | UInt64 |
| enable_compact_after_write | 1 | 1 | DEFAULT | 启用写后压缩（copy/insert/replace-into/merge-into），需要更多内存。 | UInt64 |
| enable_cse_optimizer | 0 | 0 | DEFAULT | 启用公共子表达式消除优化。 | UInt64 |
| enable_decimal_sum_widening | 0 | 0 | DEFAULT | 自动将 SUM 参数从 Decimal(19..38, scale) 扩展为 Decimal(76, scale)。 | UInt64 |
| enable_dio | 1 | 1 | DEFAULT | 启用 Direct IO。 | UInt64 |
| enable_distributed_compact | 0 | 0 | DEFAULT | 启用表压缩的分布式执行。 | UInt64 |
| enable_distributed_copy_into | 1 | 1 | DEFAULT | 启用 'COPY INTO' 的分布式执行。 | UInt64 |
| enable_distributed_merge_into | 1 | 1 | DEFAULT | 启用 'MERGE INTO' 的分布式执行。 | UInt64 |
| enable_distributed_pruning | 1 | 1 | DEFAULT | 启用分布式索引剪枝。 | UInt64 |
| enable_distributed_recluster | 1 | 1 | GLOBAL | 启用表重新聚簇的分布式执行。 | UInt64 |
| enable_distributed_replace_into | 0 | 0 | DEFAULT | 启用 'REPLACE INTO' 的分布式执行。 | UInt64 |
| enable_dphyp | 1 | 1 | DEFAULT | 启用 dphyp 连接顺序算法。 | UInt64 |
| enable_dst_hour_fix | 0 | 0 | DEFAULT | 时间转换通过增加一小时处理无效夏令时。精度无法保证（默认禁用）。 | UInt64 |
| enable_expand_roles | 1 | 1 | DEFAULT | 执行 SHOW GRANTS 语句时启用角色展开（默认启用）。 | UInt64 |
| enable_experiment_aggregate | 1 | 1 | DEFAULT | 启用实验性聚合（默认启用）。 | UInt64 |
| enable_experiment_hash_index | 1 | 1 | DEFAULT | 实验性设置：启用哈希索引（默认启用）。 | UInt64 |
| enable_experimental_connection_privilege_check | 0 | 0 | DEFAULT | 实验性设置：启用连接对象权限检查（默认禁用）。 | UInt64 |
| enable_experimental_new_join | 1 | 1 | DEFAULT | 启用实验性新连接实现。 | UInt64 |
| enable_experimental_procedure | 1 | 1 | GLOBAL | 启用 'PROCEDURE' 的实验性功能。 | UInt64 |
| enable_experimental_rbac_check | 1 | 1 | DEFAULT | 实验性设置：启用 stage 和 udf 权限检查（默认启用）。 | UInt64 |
| enable_experimental_row_access_policy | 0 | 0 | DEFAULT | 实验性设置：启用行访问策略（默认禁用）。 | UInt64 |
| enable_experimental_sequence_privilege_check | 0 | 0 | DEFAULT | 实验性设置：启用序列对象权限检查（默认禁用）。 | UInt64 |
| enable_experimental_table_ref | 0 | 0 | DEFAULT | 实验性设置：启用 table ref（默认禁用）。 | UInt64 |
| enable_experimental_virtual_column | 0 | 0 | DEFAULT | 启用实验性虚拟列功能。 | UInt64 |
| enable_fixed_rows_sort | 1 | 1 | DEFAULT | 启用固定行数排序序列化。 | UInt64 |
| enable_geo_create_table | 1 | 1 | DEFAULT | 支持创建和修改含 geometry/geography 类型的表。 | UInt64 |
| enable_group_by_column_first | 0 | 0 | DEFAULT | 在 SELECT 别名之前先将 GROUP BY 名称解析为输入列。默认禁用以保持兼容性。 | UInt64 |
| enable_hive_parquet_predict_pushdown | 1 | 1 | DEFAULT | 将此变量设置为 1 以启用 Hive Parquet 谓词下推，默认值：1。 | UInt64 |
| enable_join_runtime_filter | 1 | 1 | DEFAULT | 为 JOIN 启用运行时过滤器优化。 | UInt64 |
| enable_last_snapshot_location_hint | 1 | 1 | DEFAULT | 启用写入 last_snapshot_location_hint 对象。 | UInt64 |
| enable_loser_tree_merge_sort | 1 | 1 | DEFAULT | 启用败者树归并排序。 | UInt64 |
| enable_materialized_cte | 1 | 1 | DEFAULT | 启用物化公共表表达式（CTE）。 | UInt64 |
| enable_merge_into_row_fetch | 1 | 1 | DEFAULT | 启用 MERGE INTO 行获取优化。 | UInt64 |
| enable_mutation_block_id_repartition | 1 | 1 | DEFAULT | 在连接型变更操作（MERGE INTO、UPDATE...FROM）中的行获取之前启用本地 block_id 重分区，减少重复块读取。 | UInt64 |
| enable_new_copy_for_text_formats | 1 | 1 | DEFAULT | 使用新实现加载 CSV 文件。 | UInt64 |
| enable_optimizer_trace | 0 | 0 | DEFAULT | 启用优化器追踪。 | UInt64 |
| enable_parallel_multi_merge_sort | 1 | 1 | DEFAULT | 启用并行多路归并排序。 | UInt64 |
| enable_parallel_union_all | 0 | 0 | DEFAULT | 启用并行 UNION ALL。默认为 0，1 表示启用。 | UInt64 |
| enable_parquet_page_index | 1 | 1 | DEFAULT | 启用 Parquet 页面索引。 | UInt64 |
| enable_parquet_prewhere | 0 | 0 | DEFAULT | 启用 Parquet prewhere。 | UInt64 |
| enable_parquet_rowgroup_pruning | 1 | 1 | DEFAULT | 启用 Parquet 行组剪枝。 | UInt64 |
| enable_planner_cache | 1 | 1 | DEFAULT | 启用相同查询的逻辑计划缓存。 | UInt64 |
| enable_proxy_bloom_pruning | 0 | 0 | DEFAULT | 在 PROXY 轻量级路由估算期间启用布隆索引剪枝。默认禁用以降低路由开销。 | UInt64 |
| enable_prune_cache | 1 | 1 | DEFAULT | 启用剪枝结果缓存。 | UInt64 |
| enable_prune_pipeline | 1 | 1 | DEFAULT | 启用剪枝流水线。 | UInt64 |
| enable_query_result_cache | 0 | 0 | DEFAULT | 启用查询结果缓存以提高相同查询的性能。 | UInt64 |
| enable_refresh_aggregating_index_after_write | 1 | 1 | DEFAULT | 新数据写入后刷新聚合索引。 | UInt64 |
| enable_replace_into_partitioning | 1 | 1 | DEFAULT | 为 replace-into 语句启用分区（如果表有聚簇键）。 | UInt64 |
| enable_result_set_spilling | 0 | 0 | DEFAULT | 内存使用超过阈值时启用结果集数据溢出到存储。 | UInt64 |
| enable_selector_executor | 1 | 1 | DEFAULT | 为过滤表达式启用选择器执行器。 | UInt64 |
| enable_shuffle_sort | 0 | 0 | DEFAULT | 启用 shuffle 排序。 | UInt64 |
| enable_sort_spill_prefetch | 1 | 1 | DEFAULT | 启用溢出排序块的异步恢复预取。 | UInt64 |
| enable_sort_spill_stream_regroup | 1 | 1 | DEFAULT | 启用按域对排序溢出流在归并前重新分组。 | UInt64 |
| enable_strict_datetime_parser | 1 | 1 | DEFAULT | 启用后，日期时间函数仅接受 ISO 8601 格式。禁用后回退到尽力解析模式。 | UInt64 |
| enable_table_lock | 1 | 1 | DEFAULT | 在必要时启用表锁（默认启用）。 | UInt64 |
| enable_table_snapshot_stats | 0 | 0 | DEFAULT | 启用快照表统计信息分析。 | UInt64 |
| enforce_broadcast_join | 0 | 0 | DEFAULT | 强制使用广播连接。 | UInt64 |
| enforce_local | 0 | 0 | DEFAULT | 强制使用本地计划。 | UInt64 |
| enforce_shuffle_join | 0 | 0 | DEFAULT | 强制使用 shuffle 连接。 | UInt64 |
| error_on_nondeterministic_update | 1 | 1 | DEFAULT | 更新多连接行时是否返回错误。 | UInt64 |
| external_server_connect_timeout_secs | 10 | 10 | DEFAULT | 连接外部服务器的超时时间（秒）。 | UInt64 |
| external_server_request_batch_rows | 65536 | 65536 | DEFAULT | 发送到外部服务器的每批请求行数。 | UInt64 |
| external_server_request_max_threads | 256 | 256 | DEFAULT | 外部服务器请求的最大线程数。 | UInt64 |
| external_server_request_retry_times | 8 | 8 | DEFAULT | 外部服务器请求的最大重试次数。 | UInt64 |
| external_server_request_timeout_secs | 180 | 180 | DEFAULT | 外部服务器请求的超时时间（秒）。 | UInt64 |
| flight_client_keep_alive_interval_secs | 0 | 0 | DEFAULT | 两次 Flight TCP 保活探测之间的间隔（秒）。0 表示禁用保活。 | UInt64 |
| flight_client_keep_alive_retries | 0 | 0 | DEFAULT | Flight 连接在宣告对端不可达前的 TCP 保活重试次数。0 表示禁用保活。 | UInt64 |
| flight_client_keep_alive_time_secs | 0 | 0 | DEFAULT | Flight TCP 连接发送保活探测前的空闲时间（秒）。0 表示禁用保活。 | UInt64 |
| flight_client_timeout | 60 | 60 | DEFAULT | 设置 Flight 客户端请求可以被处理的最大时间（秒）。 | UInt64 |
| flight_connection_max_retry_times | 0 | 0 | DEFAULT | 集群 Flight 的最大重试次数。0 表示禁用。 | UInt64 |
| flight_connection_retry_interval | 1 | 1 | DEFAULT | 集群 Flight 的重试间隔（秒）。 | UInt64 |
| force_aggregate_data_spill | 0 | 0 | DEFAULT | 仅用于测试。启用后聚合数据将被强制溢出到外部存储。 | UInt64 |
| force_aggregate_shuffle_mode | auto | auto | DEFAULT | 仅用于测试。聚合的 shuffle 模式。选项：'auto'、'row'、'bucket'。 | String |
| force_eager_aggregate | 0 | 0 | DEFAULT | 强制应用 eager aggregate 规则。 | UInt64 |
| force_join_data_spill | 0 | 0 | DEFAULT | 仅用于测试。启用后连接数据将被强制溢出到外部存储。 | UInt64 |
| force_materialized_cte_spill | 0 | 0 | DEFAULT | 仅用于测试。启用后物化 CTE 数据将被强制溢出到外部存储。 | UInt64 |
| force_sort_data_spill | 0 | 0 | DEFAULT | 仅用于测试。启用后排序数据将被强制溢出到外部存储。 | UInt64 |
| force_window_data_spill | 0 | 0 | DEFAULT | 仅用于测试。启用后窗口数据将被强制溢出到外部存储。 | UInt64 |
| format_null_as_str | 0 | 0 | DEFAULT | 在查询 API 响应中将 NULL 格式化为字符串。 | UInt64 |
| geometry_output_format | GeoJSON | GeoJSON | DEFAULT | GEOMETRY 值的显示格式。可选值："WKT"、"WKB"、"EWKT"、"EWKB"、"GeoJSON"。 | String |
| group_by_shuffle_mode | before_merge | before_merge | DEFAULT | Group by 的 shuffle 模式。'before_partial' 更均衡，但需要交换更多数据。 | String |
| grouping_sets_channel_size | 2 | 2 | DEFAULT | 设置 grouping sets 到 union 转换的通道大小。 | UInt64 |
| grouping_sets_to_union | 0 | 0 | DEFAULT | 启用 grouping sets 转换为 union。 | UInt64 |
| hash_shuffle_bytes_threshold | 4194304 | 4194304 | DEFAULT | 哈希 shuffle 块分区流的最大字节阈值。 | UInt64 |
| hash_shuffle_rows_threshold | 8192 | 8192 | DEFAULT | 哈希 shuffle 块分区流的最大行数阈值。 | UInt64 |
| hide_options_in_show_create_table | 1 | 1 | DEFAULT | 在 SHOW TABLE CREATE 结果末尾隐藏 SNAPSHOT_LOCATION 和 STORAGE_FORMAT 等信息。 | UInt64 |
| hilbert_clustering_min_bytes | 107374182400 | 107374182400 | DEFAULT | 设置 Hilbert 聚簇的最小块字节大小。 | UInt64 |
| hilbert_num_range_ids | 1000 | 1000 | DEFAULT | 指定 Hilbert 聚簇中范围 ID 的域。值越大粒度越细，但可能带来性能开销。 | UInt64 |
| hilbert_sample_size_per_block | 1000 | 1000 | DEFAULT | 指定 Hilbert 聚簇中每块使用的采样点数量。 | UInt64 |
| hive_parquet_chunk_size | 16384 | 16384 | DEFAULT | 每次从 Parquet 读取到 Databend 处理器的最大行数。 | UInt64 |
| http_handler_result_timeout_secs | 240 | 240 | DEFAULT | HTTP 查询会话在无任何轮询时过期的超时时间（秒）。 | UInt64 |
| http_json_result_mode | display | display | DEFAULT | 控制 HTTP 查询 JSON 数据的编码方式。可选值："display"、"driver"。 | String |
| idle_transaction_timeout_secs | 14400 | 14400 | DEFAULT | 无查询的活跃会话超时时间（秒）。 | UInt64 |
| inlist_runtime_bloom_prune_threshold | 64 | 64 | DEFAULT | IN 列表中用于运行时块布隆剪枝的最大值数量。 | UInt64 |
| inlist_runtime_filter_threshold | 1024 | 1024 | DEFAULT | IN 列表中用于运行时过滤器生成的最大值数量。 | UInt64 |
| inlist_to_join_threshold | 1024 | 1024 | DEFAULT | 将 IN 列表转换为 JOIN 的阈值。 | UInt64 |
| input_read_buffer_size | 4194304 | 4194304 | DEFAULT | 设置缓冲读取器从存储读取数据所用缓冲区的内存大小（字节）。 | UInt64 |
| join_runtime_filter_selectivity_threshold | 10 | 10 | DEFAULT | 布隆连接运行时过滤器的选择率阈值（百分比）。默认 10 表示 10%。 | UInt64 |
| join_spilling_buffer_threshold_per_proc_mb | 512 | 512 | DEFAULT | 每个连接处理器的溢出缓冲区阈值（MB）。 | UInt64 |
| join_spilling_memory_ratio | 60 | 60 | LOCAL | 设置哈希连接在查询执行期间溢出前可使用的最大内存比率。0 表示无限制。 | UInt64 |
| join_spilling_partition_bits | 4 | 4 | DEFAULT | 设置连接溢出的分区数。默认值为 4，即 2^4 个分区。 | UInt64 |
| lazy_read_across_join_threshold | 10 | 10 | DEFAULT | 启用跨连接延迟读取优化的最大 LIMIT。设置为 0 可禁用此优化。 | UInt64 |
| lazy_read_threshold | 1000 | 1000 | DEFAULT | 设置启用延迟读取优化的最大 LIMIT。设置为 0 可禁用此优化。 | UInt64 |
| load_file_metadata_expire_hours | 24 | 24 | DEFAULT | 设置使用 COPY INTO 加载数据的文件元数据过期时间（小时）。 | UInt64 |
| materialized_cte_spilling_memory_ratio | 60 | 60 | DEFAULT | 设置物化 CTE 执行溢出前可使用的最大内存比率。0 表示无限制。 | UInt64 |
| max_aggregate_restore_worker | 16 | 16 | DEFAULT | 设置聚合恢复的最大工作线程数。 | UInt64 |
| max_aggregate_spill_level | 3 | 3 | DEFAULT | 聚合溢出的最大递归深度。每层将数据重分区为 4 个更小的部分。 | UInt64 |
| max_block_bytes | 52428800 | 52428800 | DEFAULT | 设置可读取的单个数据块的最大字节大小。 | UInt64 |
| max_block_size | 65536 | 65536 | DEFAULT | 设置可读取的单个数据块的最大行数。 | UInt64 |
| max_cte_recursive_depth | 1000 | 1000 | DEFAULT | 递归 CTE 的最大递归深度。 | UInt64 |
| max_execute_time_in_seconds | 0 | 0 | DEFAULT | 设置查询执行的最大时间（秒）。设置为 0 表示无限制。 | UInt64 |
| max_hash_join_spill_level | 1 | 1 | DEFAULT | 哈希连接溢出的最大递归深度。每层将数据重分区为 16 个更小的部分。 | UInt64 |
| max_inlist_to_or | 3 | 3 | DEFAULT | 设置 IN 表达式中可转换为 OR 运算符的最大值数量。 | UInt64 |
| max_memory_usage | 51539607552 | 51539607552 | DEFAULT | 设置处理单个查询的最大内存使用量（字节）。 | UInt64 |
| max_public_keys_per_user | 10 | 10 | DEFAULT | 每个用户密钥对认证允许的最大公钥数量。 | UInt64 |
| max_push_down_limit | 10000 | 10000 | DEFAULT | 设置可下推到叶节点算子的最大行数限制。 | UInt64 |
| max_query_memory_usage | 25769803776 | 25769803776 | LOCAL | 单个查询的最大内存使用量。设置为 0 表示无限制。 | UInt64 |
| max_result_rows | 0 | 0 | DEFAULT | 未指定特定行数时查询结果可返回的最大行数。设置为 0 表示无限制。 | UInt64 |
| max_set_operator_count | 18446744073709551615 | 18446744073709551615 | DEFAULT | 查询中集合运算符的最大数量。 | UInt64 |
| max_spill_io_requests | 8 | 8 | DEFAULT | 设置并发溢出 I/O 请求的最大数量。 | UInt64 |
| max_storage_io_requests | 64 | 64 | DEFAULT | 设置并发存储 I/O 请求的最大数量。 | UInt64 |
| max_threads | 8 | 8 | DEFAULT | 设置执行请求的最大线程数。 | UInt64 |
| max_vacuum_temp_files_after_query | 18446744073709551615 | 18446744073709551615 | DEFAULT | 查询后将删除的最大临时文件数。设置为 0 可禁用。 | UInt64 |
| max_vacuum_threads | 1 | 1 | DEFAULT | 执行 VACUUM 操作使用的最大线程数。 | UInt64 |
| min_max_runtime_filter_threshold | 18446744073709551615 | 18446744073709551615 | DEFAULT | 设置 min-max 运行时过滤器生成的最大行数。 | UInt64 |
| nested_loop_join_threshold | 10000 | 10000 | DEFAULT | 使用嵌套循环连接的阈值。设置为 0 可禁用嵌套循环连接。 | UInt64 |
| network_policy |  |  | DEFAULT | 租户中所有用户的网络策略。 | String |
| numeric_cast_option | rounding | rounding | DEFAULT | 设置数字转换模式为 "rounding"（四舍五入）或 "truncating"（截断）。 | String |
| optimizer_skip_list |  |  | DEFAULT | 查询优化期间要跳过的优化器名称列表（逗号分隔）。 | String |
| parquet_fast_read_bytes | 1048576 | 1048576 | LOCAL | 小于此大小的 Parquet 文件将作为整个文件读取，而非逐列读取。默认值：1MB。 | UInt64 |
| parquet_max_block_size | 8192 | 8192 | DEFAULT | Parquet 读取器的最大块大小。 | UInt64 |
| parquet_rowgroup_hint_bytes | 134217728 | 134217728 | DEFAULT | 将大型 Parquet 文件分割为多个行组读取时的提示字节大小。默认值：128MB。 | UInt64 |
| parse_datetime_ignore_remainder | 1 | 1 | GLOBAL | 解析字符串为日期时间时忽略尾部字符。 | UInt64 |
| persist_materialized_cte | 1 | 1 | DEFAULT | 决定物化 CTE 是否应持久化到磁盘。 | UInt64 |
| prefer_broadcast_join | 1 | 1 | DEFAULT | 启用广播连接。 | UInt64 |
| prewhere_selectivity_threshold | 100 | 100 | DEFAULT | prewhere 期间将行选择下推到剩余列读取的最大选择率百分比。 | UInt64 |
| proxy_routing_model | statistics | statistics | DEFAULT | 控制 PROXY 选择目标表的方式。可选值：'statistics'、'prefix'。 | String |
| purge_duplicated_files_in_copy | 0 | 0 | DEFAULT | 在 COPY INTO 执行期间清除检测到的重复文件。 | UInt64 |
| queries_queue_retry_timeout | 300 | 300 | DEFAULT | 查询队列超时的重试间隔。0 表示永不重试。 | UInt64 |
| query_flight_compression | LZ4 | LZ4 | DEFAULT | Flight 压缩方法。可选值："None"、"LZ4"、"ZSTD"。 | String |
| query_out_of_memory_behavior | spilling | spilling | LOCAL | 查询超出内存限制时系统执行的预定义操作。可选值："throw"、"spilling"。 | String |
| query_result_cache_allow_inconsistent | 0 | 0 | DEFAULT | 确定 Databend 是否返回与底层数据不一致的缓存查询结果。 | UInt64 |
| query_result_cache_max_bytes | 1048576 | 1048576 | DEFAULT | 设置单个查询结果缓存的最大字节大小。 | UInt64 |
| query_result_cache_min_execute_secs | 1 | 1 | DEFAULT | 查询被缓存所需的最少执行秒数（获取第一个块的时间）。 | UInt64 |
| query_result_cache_ttl_secs | 300 | 300 | DEFAULT | 设置缓存查询结果的生存时间（TTL）（秒）。 | UInt64 |
| query_tag |  |  | DEFAULT | 设置本次会话的查询标签。 | String |
| quoted_ident_case_sensitive | 1 | 1 | GLOBAL | 设置为 1 对带引号的名称区分大小写，设置为 0 则不区分。 | UInt64 |
| random_function_seed | 0 | 0 | DEFAULT | 随机函数的种子。 | UInt64 |
| recluster_block_size | 9277129359 | 9277129359 | DEFAULT | 设置重新聚簇块的最大字节大小。 | UInt64 |
| recluster_timeout_secs | 43200 | 43200 | DEFAULT | 设置重新聚簇最终超时的秒数。 | UInt64 |
| replace_into_bloom_pruning_max_column_number | 4 | 4 | DEFAULT | replace-into 语句中布隆剪枝使用的最大列数。 | UInt64 |
| replace_into_shuffle_strategy | 0 | 0 | DEFAULT | 选择 shuffle 策略：0 表示块级，1 表示段级。 | UInt64 |
| s3_storage_class | STANDARD | STANDARD | DEFAULT | 默认 S3 存储类别。可选值："STANDARD"、"INTELLIGENT_TIERING"。 | String |
| sandbox_tenant |  |  | DEFAULT | 向此会话注入自定义 sandbox_tenant。仅用于测试，需开启 internal_enable_sandbox_tenant。 | String |
| script_max_steps | 10000 | 10000 | DEFAULT | 单次脚本执行中允许的最大步骤数。 | UInt64 |
| short_sql_max_length | 2048 | 2048 | DEFAULT | 设置 short_sql 函数中截断 SQL 查询的最大长度。 | UInt64 |
| sort_spilling_batch_bytes | 20971520 | 20971520 | DEFAULT | 设置归并排序器溢出到存储的未压缩数据大小。 | UInt64 |
| sort_spilling_memory_ratio | 60 | 60 | LOCAL | 设置排序器在查询执行期间溢出前可使用的最大内存比率。 | UInt64 |
| spatial_runtime_filter_threshold | 1024 | 1024 | DEFAULT | 空间列表中用于运行时过滤器生成的最大值数量。 | UInt64 |
| spill_writer_memory_pool_size_mb | 20 | 20 | DEFAULT | 每个溢出写入器的内存池大小（MB）。 | UInt64 |
| spilling_file_format | parquet | parquet | DEFAULT | 溢出存储的文件格式。可选值："arrow"、"parquet"。 | String |
| spilling_to_disk_vacuum_unknown_temp_dirs_limit | 18446744073709551615 | 18446744073709551615 | DEFAULT | 需要清理的最大目录数（针对意外中断查询遗留的临时目录）。 | UInt64 |
| sql_dialect | PostgreSQL | PostgreSQL | DEFAULT | 设置 SQL 方言。可选值："PostgreSQL"、"MySQL"、"Experimental"、"Hive"、"Prql"。 | String |
| statement_queue_ttl_in_seconds | 15 | 15 | DEFAULT | 与元服务保持活跃通信的租约续期操作间隔（秒）。 | UInt64 |
| statement_queued_timeout_in_seconds | 0 | 0 | DEFAULT | 语句在队列中等待的最大秒数。默认值为 0（无限制）。 | UInt64 |
| storage_fetch_part_num | 2 | 2 | DEFAULT | 设置查询执行期间从存储并行获取的分区数量。 | UInt64 |
| storage_io_max_page_bytes_for_read | 524288 | 524288 | DEFAULT | 单次 I/O 操作从存储读取的数据页最大字节大小。 | UInt64 |
| storage_io_min_bytes_for_seek | 48 | 48 | DEFAULT | 在数据文件中寻址新位置时，单次 I/O 操作必须读取的最小数据字节大小。 | UInt64 |
| storage_read_buffer_size | 1048576 | 1048576 | DEFAULT | 设置用于将数据读入内存的缓冲区大小（字节）。 | UInt64 |
| stream_consume_batch_size_hint | 0 | 0 | DEFAULT | 流消费的批处理大小提示。设置为 0 可禁用。 | UInt64 |
| system_tables_count_db_concurrency | 16 | 16 | DEFAULT | system.tables 计数优化使用的数据库级并发数。 | UInt64 |
| table_lock_expire_secs | 30 | 30 | DEFAULT | 设置表锁过期的秒数。 | UInt64 |
| timezone | UTC | UTC | DEFAULT | 设置时区。 | String |
| trace_sample_rate | 1 | 1 | DEFAULT | 分布式追踪的采样率。取值范围：0–100。 | UInt64 |
| udf_cloud_import_presign_expire_secs | 259200 | 259200 | DEFAULT | 云 UDF Stage 导入预签名 URL 的过期时间（秒）。 | UInt64 |
| unquoted_ident_case_sensitive | 0 | 0 | DEFAULT | 设置为 1 使不带引号的名称区分大小写，设置为 0 则不区分。 | UInt64 |
| use_legacy_query_executor | 0 | 0 | DEFAULT | 回退到旧版查询执行器。 | UInt64 |
| use_parquet2 | 0 | 0 | DEFAULT | 此设置已废弃。 | UInt64 |
| warehouse |  |  | DEFAULT | 请使用 `USE WAREHOUSE` 语句设置仓库。此设置仅用于在客户端和服务器之间同步仓库状态。 | String |
| week_start | 1 | 1 | DEFAULT | 指定一周的第一天（用于与周相关的日期函数）。 | UInt64 |
| window_num_partitions | 256 | 256 | DEFAULT | 设置窗口算子的分区数量。 | UInt64 |
| window_partition_sort_block_size | 65536 | 65536 | DEFAULT | 设置窗口分区中待排序数据块的块大小。 | UInt64 |
| window_partition_spilling_memory_ratio | 60 | 60 | GLOBAL | 设置窗口分区器在查询执行期间溢出前可使用的最大内存比率。 | UInt64 |
| window_spill_unit_size_mb | 256 | 256 | DEFAULT | 设置窗口算子的溢出单元大小（MB）。 | UInt64 |
