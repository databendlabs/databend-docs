---
title: system.query_log
---

一个只读的内存表，存储所有查询日志。

## 示例

```sql
SELECT * FROM system.query_log LIMIT 1;

-[ RECORD 1 ]-----------------------------------
                log_type: 1
           log_type_name: Start
            handler_type: HTTPQuery
               tenant_id: default
              cluster_id: default
                 node_id: zv3rra2vO7f9WUgqIu8WH
                sql_user: root
          sql_user_quota: UserQuota<cpu:0,mem:0,store:0>
     sql_user_privileges: GRANT ALL ON *.*, ROLES: ["account_admin"]
                query_id: 7e03cd7a-36fa-463d-afe4-041da4092c45
              query_kind: Other
              query_text: SHOW TABLES
              query_hash: 9c36cac1372650b703400c60dd29042c
query_parameterized_hash: 9c36cac1372650b703400c60dd29042c
              event_date: 2024-07-30
              event_time: 2024-07-30 04:27:29.296596
        query_start_time: 2024-07-30 04:27:29.252170
       query_duration_ms: 0
query_queued_duration_ms: 0
        current_database: default
               databases:
                  tables:
                 columns:
             projections:
            written_rows: 0
           written_bytes: 0
       join_spilled_rows: 0
      join_spilled_bytes: 0
        agg_spilled_rows: 0
       agg_spilled_bytes: 0
   group_by_spilled_rows: 0
  group_by_spilled_bytes: 0
        written_io_bytes: 0
written_io_bytes_cost_ms: 0
               scan_rows: 0
              scan_bytes: 0
           scan_io_bytes: 0
   scan_io_bytes_cost_ms: 0
         scan_partitions: 0
        total_partitions: 0
             result_rows: 0
            result_bytes: 0
               cpu_usage: 8
            memory_usage: 0
  bytes_from_remote_disk: 0
   bytes_from_local_disk: 0
       bytes_from_memory: 0
             client_info:
          client_address: 192.168.65.1
              user_agent: bendsql/0.19.2-1e338e1
          exception_code: 0
          exception_text:
             stack_trace:
          server_version: v1.2.583-nightly-03c09a571d(rust-1.81.0-nightly-2024-07-25T22:12:15.571684726Z)
        session_settings: acquire_lock_timeout=30, aggregate_spilling_bytes_threshold_per_proc=0, aggregate_spilling_memory_ratio=60, auto_compaction_imperfect_blocks_threshold=25, collation=utf8, compact_max_block_selection=10000, cost_factor_aggregate_per_row=5, cost_factor_hash_table_per_row=10, cost_factor_network_per_row=50, create_query_flight_client_with_current_rt=1, data_retention_time_in_days=1, ddl_column_type_nullable=1, disable_join_reorder=0, disable_merge_into_join_reorder=0, disable_variant_check=0, efficiently_memory_group_by=0, enable_aggregating_index_scan=1, enable_auto_fix_missing_bloom_index=0, enable_bloom_runtime_filter=1, enable_cbo=1, enable_clickhouse_handler=0, enable_compact_after_write=1, enable_distributed_compact=0, enable_distributed_copy_into=1, enable_distributed_merge_into=1, enable_distributed_recluster=0, enable_distributed_replace_into=0, enable_dphyp=1, enable_dst_hour_fix=0, enable_experimental_aggregate_hashtable=1, enable_experimental_merge_into=1, enable_experimental_queries_executor=0, enable_experimental_rbac_check=1, enable_geo_create_table=0, enable_hive_parquet_predict_pushdown=1, enable_loser_tree_merge_sort=0, enable_merge_into_row_fetch=1, enable_new_copy_for_text_formats=1, enable_parquet_page_index=1, enable_parquet_prewhere=0, enable_parquet_rowgroup_pruning=1, enable_query_result_cache=0, enable_refresh_aggregating_index_after_write=1, enable_refresh_virtual_column_after_write=1, enable_replace_into_partitioning=1, enable_strict_datetime_parser=1, enable_table_lock=1, enforce_broadcast_join=0, external_server_connect_timeout_secs=10, external_server_request_batch_rows=65536, external_server_request_timeout_secs=180, flight_client_timeout=60, format_null_as_str=1, geometry_output_format=GeoJSON, group_by_shuffle_mode=before_merge, group_by_two_level_threshold=20000, hide_options_in_show_create_table=1, hive_parquet_chunk_size=16384, http_handler_result_timeout_secs=60, idle_transaction_timeout_secs=14400, inlist_to_join_threshold=1024, input_read_buffer_size=4194304, join_spilling_buffer_threshold_per_proc_mb=1024, join_spilling_bytes_threshold_per_proc=0, join_spilling_memory_ratio=60, join_spilling_partition_bits=4, lazy_read_threshold=1000, load_file_metadata_expire_hours=24, max_block_size=65536, max_cte_recursive_depth=1000, max_execute_time_in_seconds=0, max_inlist_to_or=3, max_memory_usage=6577507532, max_result_rows=0, max_set_operator_count=18446744073709551615, max_storage_io_requests=48, max_threads=8, max_vacuum_temp_files_after_query=18446744073709551615, numeric_cast_option=rounding, parquet_fast_read_bytes=16777216, parquet_max_block_size=8192, parse_datetime_ignore_remainder=1, prefer_broadcast_join=1, purge_duplicated_files_in_copy=0, query_flight_compression=LZ4, query_result_cache_allow_inconsistent=0, query_result_cache_max_bytes=1048576, query_result_cache_min_execute_secs=1, query_result_cache_ttl_secs=300, quoted_ident_case_sensitive=1, recluster_block_size=2104802410, recluster_timeout_secs=43200, replace_into_bloom_pruning_max_column_number=4, replace_into_shuffle_strategy=0, sandbox_tenant=, script_max_steps=10000, sort_spilling_batch_bytes=8388608, sort_spilling_bytes_threshold_per_proc=0, sort_spilling_memory_ratio=60, sql_dialect=PostgreSQL, statement_queued_timeout_in_seconds=0, storage_fetch_part_num=2, storage_io_max_page_bytes_for_read=524288, storage_io_min_bytes_for_seek=48, storage_read_buffer_size=1048576, table_lock_expire_secs=20, timezone=UTC, unquoted_ident_case_sensitive=0, use_parquet2=0, scope: SESSION
                   extra:
             has_profile: false
```