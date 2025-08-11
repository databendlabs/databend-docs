const siteRedirects = [
  {
    from: '/',
    to: '/guides/'
  },
  {
    from: '/sql/sql-reference/table-engines/iceberg',
    to: '/guides/access-data-lake/iceberg/'
  },
  // AI Functions redirects - functions moved to external implementation
  {
    from: '/sql/sql-functions/ai-functions/ai-cosine-distance',
    to: '/sql/sql-functions/vector-functions/vector-cosine-distance'
  },
  {
    from: '/sql/sql-functions/ai-functions/ai-text-completion',
    to: '/guides/ai-functions/'
  },
  {
    from: '/sql/sql-functions/ai-functions/ai-embedding-vector',
    to: '/guides/ai-functions/'
  },
  {
    from: '/sql/sql-functions/ai-functions/ai-to-sql',
    to: '/guides/ai-functions/'
  },
  {
    from: '/sql/sql-functions/ai-functions/',
    to: '/guides/ai-functions/'
  },
  {
    from: '/guides/migrate/',
    to: '/tutorials/migrate/'
  },
  {
    from: '/guides/migrate/mysql',
    to: '/tutorials/migrate/migrating-from-mysql-with-db-archiver'
  },
  {
    from: '/en/guides/deploy/upgrade/upgrade',
    to: '/guides/deploy/upgrade/compatibility/'
  },
  // Array Functions: 00-array-functions -> 10-semi-structured-functions/array
  {
    from: '/sql/sql-functions/array-functions/array-aggregate',
    to: '/sql/sql-functions/semi-structured-functions/array/array-aggregate'
  },
  {
    from: '/sql/sql-functions/array-functions/array-append',
    to: '/sql/sql-functions/semi-structured-functions/array/array-append'
  },
  {
    from: '/sql/sql-functions/array-functions/array-compact',
    to: '/sql/sql-functions/semi-structured-functions/array/array-compact'
  },
  {
    from: '/sql/sql-functions/array-functions/array-concat',
    to: '/sql/sql-functions/semi-structured-functions/array/array-concat'
  },
  {
    from: '/sql/sql-functions/array-functions/array-construct',
    to: '/sql/sql-functions/semi-structured-functions/array/array-construct'
  },
  {
    from: '/sql/sql-functions/array-functions/array-contains',
    to: '/sql/sql-functions/semi-structured-functions/array/array-contains'
  },
  {
    from: '/sql/sql-functions/array-functions/array-distinct',
    to: '/sql/sql-functions/semi-structured-functions/array/array-distinct'
  },
  {
    from: '/sql/sql-functions/array-functions/array-except',
    to: '/sql/sql-functions/semi-structured-functions/array/array-except'
  },
  {
    from: '/sql/sql-functions/array-functions/array-filter',
    to: '/sql/sql-functions/semi-structured-functions/array/array-filter'
  },
  {
    from: '/sql/sql-functions/array-functions/array-flatten',
    to: '/sql/sql-functions/semi-structured-functions/array/array-flatten'
  },
  {
    from: '/sql/sql-functions/array-functions/array-get',
    to: '/sql/sql-functions/semi-structured-functions/array/array-get'
  },
  {
    from: '/sql/sql-functions/array-functions/array-indexof',
    to: '/sql/sql-functions/semi-structured-functions/array/array-indexof'
  },
  {
    from: '/sql/sql-functions/array-functions/array-insert',
    to: '/sql/sql-functions/semi-structured-functions/array/array-insert'
  },
  {
    from: '/sql/sql-functions/array-functions/array-intersection',
    to: '/sql/sql-functions/semi-structured-functions/array/array-intersection'
  },
  {
    from: '/sql/sql-functions/array-functions/array-overlap',
    to: '/sql/sql-functions/semi-structured-functions/array/array-overlap'
  },
  {
    from: '/sql/sql-functions/array-functions/array-prepend',
    to: '/sql/sql-functions/semi-structured-functions/array/array-prepend'
  },
  {
    from: '/sql/sql-functions/array-functions/array-reduce',
    to: '/sql/sql-functions/semi-structured-functions/array/array-reduce'
  },
  {
    from: '/sql/sql-functions/array-functions/array-remove-first',
    to: '/sql/sql-functions/semi-structured-functions/array/array-remove-first'
  },
  {
    from: '/sql/sql-functions/array-functions/array-remove-last',
    to: '/sql/sql-functions/semi-structured-functions/array/array-remove-last'
  },
  {
    from: '/sql/sql-functions/array-functions/array-remove',
    to: '/sql/sql-functions/semi-structured-functions/array/array-remove'
  },
  {
    from: '/sql/sql-functions/array-functions/array-reverse',
    to: '/sql/sql-functions/semi-structured-functions/array/array-reverse'
  },
  {
    from: '/sql/sql-functions/array-functions/array-slice',
    to: '/sql/sql-functions/semi-structured-functions/array/array-slice'
  },
  {
    from: '/sql/sql-functions/array-functions/array-transform',
    to: '/sql/sql-functions/semi-structured-functions/array/array-transform'
  },
  {
    from: '/sql/sql-functions/array-functions/array-unique',
    to: '/sql/sql-functions/semi-structured-functions/array/array-unique'
  },
  {
    from: '/sql/sql-functions/array-functions/arrays-zip',
    to: '/sql/sql-functions/semi-structured-functions/array/arrays-zip'
  },
  {
    from: '/sql/sql-functions/array-functions/contains',
    to: '/sql/sql-functions/semi-structured-functions/array/contains'
  },
  {
    from: '/sql/sql-functions/array-functions/get',
    to: '/sql/sql-functions/semi-structured-functions/array/get'
  },
  {
    from: '/sql/sql-functions/array-functions/range',
    to: '/sql/sql-functions/semi-structured-functions/array/range'
  },
  {
    from: '/sql/sql-functions/array-functions/slice',
    to: '/sql/sql-functions/semi-structured-functions/array/slice'
  },
  {
    from: '/sql/sql-functions/array-functions/unnest',
    to: '/sql/sql-functions/semi-structured-functions/array/unnest'
  },
  // Map Functions: 10-map-functions -> 10-semi-structured-functions/map
  {
    from: '/sql/sql-functions/map-functions/map-cat',
    to: '/sql/sql-functions/semi-structured-functions/map/map-cat'
  },
  {
    from: '/sql/sql-functions/map-functions/map-contains-key',
    to: '/sql/sql-functions/semi-structured-functions/map/map-contains-key'
  },
  {
    from: '/sql/sql-functions/map-functions/map-delete',
    to: '/sql/sql-functions/semi-structured-functions/map/map-delete'
  },
  {
    from: '/sql/sql-functions/map-functions/map-filter',
    to: '/sql/sql-functions/semi-structured-functions/map/map-filter'
  },
  {
    from: '/sql/sql-functions/map-functions/map-insert',
    to: '/sql/sql-functions/semi-structured-functions/map/map-insert'
  },
  {
    from: '/sql/sql-functions/map-functions/map-keys',
    to: '/sql/sql-functions/semi-structured-functions/map/map-keys'
  },
  {
    from: '/sql/sql-functions/map-functions/map-pick',
    to: '/sql/sql-functions/semi-structured-functions/map/map-pick'
  },
  {
    from: '/sql/sql-functions/map-functions/map-size',
    to: '/sql/sql-functions/semi-structured-functions/map/map-size'
  },
  {
    from: '/sql/sql-functions/map-functions/map-transform-keys',
    to: '/sql/sql-functions/semi-structured-functions/map/map-transform-keys'
  },
  {
    from: '/sql/sql-functions/map-functions/map-transform-values',
    to: '/sql/sql-functions/semi-structured-functions/map/map-transform-values'
  },
  {
    from: '/sql/sql-functions/map-functions/map-values',
    to: '/sql/sql-functions/semi-structured-functions/map/map-values'
  },
  // JSON Functions: semi-structured root -> json subdirectory
  {
    from: '/sql/sql-functions/semi-structured-functions/check-json',
    to: '/sql/sql-functions/semi-structured-functions/json/check-json'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/get-ignore-case',
    to: '/sql/sql-functions/semi-structured-functions/json/get-ignore-case'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/get-path',
    to: '/sql/sql-functions/semi-structured-functions/json/get-path'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/get',
    to: '/sql/sql-functions/semi-structured-functions/json/get'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array-elements',
    to: '/sql/sql-functions/semi-structured-functions/json/json-array-elements'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-each',
    to: '/sql/sql-functions/semi-structured-functions/json/json-each'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-extract-path-text',
    to: '/sql/sql-functions/semi-structured-functions/json/json-extract-path-text'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-path-exists',
    to: '/sql/sql-functions/semi-structured-functions/json/json-path-exists'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-path-match',
    to: '/sql/sql-functions/semi-structured-functions/json/json-path-match'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-path-query-array',
    to: '/sql/sql-functions/semi-structured-functions/json/json-path-query-array'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-path-query-first',
    to: '/sql/sql-functions/semi-structured-functions/json/json-path-query-first'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-path-query',
    to: '/sql/sql-functions/semi-structured-functions/json/json-path-query'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-pretty',
    to: '/sql/sql-functions/semi-structured-functions/json/json-pretty'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-to-string',
    to: '/sql/sql-functions/semi-structured-functions/json/json-to-string'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-typeof',
    to: '/sql/sql-functions/semi-structured-functions/json/json-typeof'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/parse-json',
    to: '/sql/sql-functions/semi-structured-functions/json/parse-json'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-strip-nulls',
    to: '/sql/sql-functions/semi-structured-functions/json/strip-null-value'
  },
  // Array Functions: JSON-prefixed names to array subdirectory
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array',
    to: '/sql/sql-functions/semi-structured-functions/array/array-construct'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array-filter',
    to: '/sql/sql-functions/semi-structured-functions/array/array-filter'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array-insert',
    to: '/sql/sql-functions/semi-structured-functions/array/array-insert'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array-overlap',
    to: '/sql/sql-functions/semi-structured-functions/array/array-overlap'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array-reduce',
    to: '/sql/sql-functions/semi-structured-functions/array/array-reduce'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-array-transform',
    to: '/sql/sql-functions/semi-structured-functions/array/array-transform'
  },
  // Object Functions: JSON-prefixed names to object subdirectory
  {
    from: '/sql/sql-functions/semi-structured-functions/json-object-keep-null',
    to: '/sql/sql-functions/semi-structured-functions/object/object-construct-keep-null'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-object',
    to: '/sql/sql-functions/semi-structured-functions/object/object-construct'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-object-delete',
    to: '/sql/sql-functions/semi-structured-functions/object/object-delete'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-object-insert',
    to: '/sql/sql-functions/semi-structured-functions/object/object-insert'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-object-pick',
    to: '/sql/sql-functions/semi-structured-functions/object/object-pick'
  },
  // Map Functions: JSON-prefixed names to map subdirectory
  {
    from: '/sql/sql-functions/semi-structured-functions/json-map-filter',
    to: '/sql/sql-functions/semi-structured-functions/map/map-filter'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/json-map-transform-keys',
    to: '/sql/sql-functions/semi-structured-functions/map/map-transform-keys'
  },
  // Type Predicate Functions: root -> type-predicate subdirectory
  {
    from: '/sql/sql-functions/semi-structured-functions/is-array',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-array'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/is-boolean',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-boolean'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/is-float',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-float'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/is-integer',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-integer'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/is-null-value',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-null-value'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/is-object',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-object'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/is-string',
    to: '/sql/sql-functions/semi-structured-functions/type-predicate/is-string'
  },
  {
    from: '/sql/sql-functions/semi-structured-functions/flatten',
    to: '/sql/sql-functions/table-functions/flatten'
  },
  {
    from: '/sql/sql-functions/vector-distance-functions/vector-cosine-distance',
    to: '/sql/sql-functions/vector-functions/vector-cosine-distance'
  },
  {
    from: '/sql/sql-functions/vector-distance-functions/vector-l1-distance',
    to: '/sql/sql-functions/vector-functions/vector-l1-distance'
  },
  {
    from: '/sql/sql-functions/vector-distance-functions/vector-l2-distance',
    to: '/sql/sql-functions/vector-functions/vector-l2-distance'
  },
  {
    from: '/sql/sql-functions/vector-distance-functions/',
    to: '/sql/sql-functions/vector-functions/'
  },
  {
    from: '/tutorials/load/automating_json_log_loading_with_vector/',
    to: '/tutorials/load/automating-json-log-loading-with-vector/'
  }
];
export default siteRedirects;