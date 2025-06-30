const siteRedirects = [
  {
    from: '/',
    to: '/guides/'
  },
  {
    from: '/sql/sql-reference/table-engines/iceberg',
    to: '/guides/access-data-lake/iceberg/'
  },
  {
    from: '/sql/sql-functions/ai-functions/ai-cosine-distance',
    to: '/sql/sql-functions/vector-distance-functions/vector-cosine-distance/'
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
    from: '/guides/migrate/snowflake',
    to: '/tutorials/migrate/migrating-from-snowflake'
  },
  // Array Functions: 00-array-functions -> 10-semi-structured-functions/array
  {
    from: '/sql/sql-functions/array-functions/*',
    to: '/sql/sql-functions/semi-structured-functions/array/*'
  },
  // Map Functions: 10-map-functions -> 10-semi-structured-functions/map
  {
    from: '/sql/sql-functions/map-functions/*',
    to: '/sql/sql-functions/semi-structured-functions/map/*'
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
  // Table Functions
  {
    from: '/sql/sql-functions/semi-structured-functions/flatten',
    to: '/sql/sql-functions/table-functions/flatten'
  }
];
export default siteRedirects;