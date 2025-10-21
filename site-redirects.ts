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
  // Geospatial Functions: merged geo- and geometry- into geospatial
  {
    from: '/sql/sql-functions/geo-functions/',
    to: '/sql/sql-functions/geospatial-functions/'
  },
  {
    from: '/sql/sql-functions/geometry-functions/',
    to: '/sql/sql-functions/geospatial-functions/'
  },
  {
    from: '/sql/sql-functions/geo-functions/geo-to-h3',
    to: '/sql/sql-functions/geospatial-functions/geo-to-h3'
  },
  {
    from: '/sql/sql-functions/geo-functions/geohash-decode',
    to: '/sql/sql-functions/geospatial-functions/geohash-decode'
  },
  {
    from: '/sql/sql-functions/geo-functions/geohash-encode',
    to: '/sql/sql-functions/geospatial-functions/geohash-encode'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-cell-area-m2',
    to: '/sql/sql-functions/geospatial-functions/h3-cell-area-m2'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-cell-area-rads2',
    to: '/sql/sql-functions/geospatial-functions/h3-cell-area-rads2'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-distance',
    to: '/sql/sql-functions/geospatial-functions/h3-distance'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-edge-angle',
    to: '/sql/sql-functions/geospatial-functions/h3-edge-angle'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-edge-length-km',
    to: '/sql/sql-functions/geospatial-functions/h3-edge-length-km'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-edge-length-m',
    to: '/sql/sql-functions/geospatial-functions/h3-edge-length-m'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-exact-edge-length-km',
    to: '/sql/sql-functions/geospatial-functions/h3-exact-edge-length-km'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-exact-edge-length-m',
    to: '/sql/sql-functions/geospatial-functions/h3-exact-edge-length-m'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-exact-edge-length-rads',
    to: '/sql/sql-functions/geospatial-functions/h3-exact-edge-length-rads'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-base-cell',
    to: '/sql/sql-functions/geospatial-functions/h3-get-base-cell'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-destination-index-from-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-destination-index-from-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-faces',
    to: '/sql/sql-functions/geospatial-functions/h3-get-faces'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-indexes-from-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-indexes-from-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-origin-index-from-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-origin-index-from-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-resolution',
    to: '/sql/sql-functions/geospatial-functions/h3-get-resolution'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-unidirectional-edge-boundary',
    to: '/sql/sql-functions/geospatial-functions/h3-get-unidirectional-edge-boundary'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-get-unidirectional-edges-from-hexagon',
    to: '/sql/sql-functions/geospatial-functions/h3-get-unidirectional-edges-from-hexagon'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-hex-area-km2',
    to: '/sql/sql-functions/geospatial-functions/h3-hex-area-km2'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-hex-area-m2',
    to: '/sql/sql-functions/geospatial-functions/h3-hex-area-m2'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-hex-ring',
    to: '/sql/sql-functions/geospatial-functions/h3-hex-ring'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-indexes-are-neighbors',
    to: '/sql/sql-functions/geospatial-functions/h3-indexes-are-neighbors'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-is-pentagon',
    to: '/sql/sql-functions/geospatial-functions/h3-is-pentagon'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-is-res-class-iii',
    to: '/sql/sql-functions/geospatial-functions/h3-is-res-class-iii'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-is-valid',
    to: '/sql/sql-functions/geospatial-functions/h3-is-valid'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-k-ring',
    to: '/sql/sql-functions/geospatial-functions/h3-k-ring'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-line',
    to: '/sql/sql-functions/geospatial-functions/h3-line'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-num-hexagons',
    to: '/sql/sql-functions/geospatial-functions/h3-num-hexagons'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-to-center-child',
    to: '/sql/sql-functions/geospatial-functions/h3-to-center-child'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-to-children',
    to: '/sql/sql-functions/geospatial-functions/h3-to-children'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-to-geo-boundary',
    to: '/sql/sql-functions/geospatial-functions/h3-to-geo-boundary'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-to-geo',
    to: '/sql/sql-functions/geospatial-functions/h3-to-geo'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-to-parent',
    to: '/sql/sql-functions/geospatial-functions/h3-to-parent'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-to-string',
    to: '/sql/sql-functions/geospatial-functions/h3-to-string'
  },
  {
    from: '/sql/sql-functions/geo-functions/h3-unidirectional-edge-is-valid',
    to: '/sql/sql-functions/geospatial-functions/h3-unidirectional-edge-is-valid'
  },
  {
    from: '/sql/sql-functions/geo-functions/haversine',
    to: '/sql/sql-functions/geospatial-functions/haversine'
  },
  {
    from: '/sql/sql-functions/geo-functions/point-in-polygon',
    to: '/sql/sql-functions/geospatial-functions/point-in-polygon'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-asbinary',
    to: '/sql/sql-functions/geospatial-functions/st-asbinary'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-asewkb',
    to: '/sql/sql-functions/geospatial-functions/st-asewkb'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-asewkt',
    to: '/sql/sql-functions/geospatial-functions/st-asewkt'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-asgeojson',
    to: '/sql/sql-functions/geospatial-functions/st-asgeojson'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-astext',
    to: '/sql/sql-functions/geospatial-functions/st-astext'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-aswkb',
    to: '/sql/sql-functions/geospatial-functions/st-aswkb'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-aswkt',
    to: '/sql/sql-functions/geospatial-functions/st-aswkt'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-contains',
    to: '/sql/sql-functions/geospatial-functions/st-contains'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-dimension',
    to: '/sql/sql-functions/geospatial-functions/st-dimension'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-distance',
    to: '/sql/sql-functions/geospatial-functions/st-distance'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-endpoint',
    to: '/sql/sql-functions/geospatial-functions/st-endpoint'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geohash',
    to: '/sql/sql-functions/geospatial-functions/st-geohash'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geom-point',
    to: '/sql/sql-functions/geospatial-functions/st-geom-point'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geometryfromewkb',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromewkb'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geometryfromewkt',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromewkt'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geometryfromtext',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromtext'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geometryfromwkb',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromwkb'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geometryfromwkt',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromwkt'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geomfromewkb',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromewkb'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geomfromewkt',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromewkt'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geomfromgeohash',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromgeohash'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geomfromtext',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromtext'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geomfromwkb',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromwkb'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geomfromwkt',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromwkt'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-geompointfromgeohash',
    to: '/sql/sql-functions/geospatial-functions/st-geompointfromgeohash'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-length',
    to: '/sql/sql-functions/geospatial-functions/st-length'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-make-line',
    to: '/sql/sql-functions/geospatial-functions/st-make-line'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-makegeompoint',
    to: '/sql/sql-functions/geospatial-functions/st-makegeompoint'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-makeline',
    to: '/sql/sql-functions/geospatial-functions/st-makeline'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-makepolygon',
    to: '/sql/sql-functions/geospatial-functions/st-makepolygon'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-npoints',
    to: '/sql/sql-functions/geospatial-functions/st-npoints'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-numpoints',
    to: '/sql/sql-functions/geospatial-functions/st-numpoints'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-pointn',
    to: '/sql/sql-functions/geospatial-functions/st-pointn'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-polygon',
    to: '/sql/sql-functions/geospatial-functions/st-polygon'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-setsrid',
    to: '/sql/sql-functions/geospatial-functions/st-setsrid'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-srid',
    to: '/sql/sql-functions/geospatial-functions/st-srid'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-startpoint',
    to: '/sql/sql-functions/geospatial-functions/st-startpoint'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-transform',
    to: '/sql/sql-functions/geospatial-functions/st-transform'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-x',
    to: '/sql/sql-functions/geospatial-functions/st-x'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-xmax',
    to: '/sql/sql-functions/geospatial-functions/st-xmax'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-xmin',
    to: '/sql/sql-functions/geospatial-functions/st-xmin'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-y',
    to: '/sql/sql-functions/geospatial-functions/st-y'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-ymax',
    to: '/sql/sql-functions/geospatial-functions/st-ymax'
  },
  {
    from: '/sql/sql-functions/geo-functions/st-ymin',
    to: '/sql/sql-functions/geospatial-functions/st-ymin'
  },
  {
    from: '/sql/sql-functions/geo-functions/string-to-h3',
    to: '/sql/sql-functions/geospatial-functions/string-to-h3'
  },
  {
    from: '/sql/sql-functions/geo-functions/to-geometry',
    to: '/sql/sql-functions/geospatial-functions/to-geometry'
  },
  {
    from: '/sql/sql-functions/geo-functions/to-string',
    to: '/sql/sql-functions/geospatial-functions/to-string'
  },
  {
    from: '/sql/sql-functions/geometry-functions/geo-to-h3',
    to: '/sql/sql-functions/geospatial-functions/geo-to-h3'
  },
  {
    from: '/sql/sql-functions/geometry-functions/geohash-decode',
    to: '/sql/sql-functions/geospatial-functions/geohash-decode'
  },
  {
    from: '/sql/sql-functions/geometry-functions/geohash-encode',
    to: '/sql/sql-functions/geospatial-functions/geohash-encode'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-cell-area-m2',
    to: '/sql/sql-functions/geospatial-functions/h3-cell-area-m2'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-cell-area-rads2',
    to: '/sql/sql-functions/geospatial-functions/h3-cell-area-rads2'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-distance',
    to: '/sql/sql-functions/geospatial-functions/h3-distance'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-edge-angle',
    to: '/sql/sql-functions/geospatial-functions/h3-edge-angle'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-edge-length-km',
    to: '/sql/sql-functions/geospatial-functions/h3-edge-length-km'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-edge-length-m',
    to: '/sql/sql-functions/geospatial-functions/h3-edge-length-m'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-exact-edge-length-km',
    to: '/sql/sql-functions/geospatial-functions/h3-exact-edge-length-km'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-exact-edge-length-m',
    to: '/sql/sql-functions/geospatial-functions/h3-exact-edge-length-m'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-exact-edge-length-rads',
    to: '/sql/sql-functions/geospatial-functions/h3-exact-edge-length-rads'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-base-cell',
    to: '/sql/sql-functions/geospatial-functions/h3-get-base-cell'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-destination-index-from-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-destination-index-from-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-faces',
    to: '/sql/sql-functions/geospatial-functions/h3-get-faces'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-indexes-from-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-indexes-from-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-origin-index-from-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-origin-index-from-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-resolution',
    to: '/sql/sql-functions/geospatial-functions/h3-get-resolution'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-unidirectional-edge',
    to: '/sql/sql-functions/geospatial-functions/h3-get-unidirectional-edge'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-unidirectional-edge-boundary',
    to: '/sql/sql-functions/geospatial-functions/h3-get-unidirectional-edge-boundary'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-get-unidirectional-edges-from-hexagon',
    to: '/sql/sql-functions/geospatial-functions/h3-get-unidirectional-edges-from-hexagon'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-hex-area-km2',
    to: '/sql/sql-functions/geospatial-functions/h3-hex-area-km2'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-hex-area-m2',
    to: '/sql/sql-functions/geospatial-functions/h3-hex-area-m2'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-hex-ring',
    to: '/sql/sql-functions/geospatial-functions/h3-hex-ring'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-indexes-are-neighbors',
    to: '/sql/sql-functions/geospatial-functions/h3-indexes-are-neighbors'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-is-pentagon',
    to: '/sql/sql-functions/geospatial-functions/h3-is-pentagon'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-is-res-class-iii',
    to: '/sql/sql-functions/geospatial-functions/h3-is-res-class-iii'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-is-valid',
    to: '/sql/sql-functions/geospatial-functions/h3-is-valid'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-k-ring',
    to: '/sql/sql-functions/geospatial-functions/h3-k-ring'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-line',
    to: '/sql/sql-functions/geospatial-functions/h3-line'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-num-hexagons',
    to: '/sql/sql-functions/geospatial-functions/h3-num-hexagons'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-to-center-child',
    to: '/sql/sql-functions/geospatial-functions/h3-to-center-child'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-to-children',
    to: '/sql/sql-functions/geospatial-functions/h3-to-children'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-to-geo-boundary',
    to: '/sql/sql-functions/geospatial-functions/h3-to-geo-boundary'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-to-geo',
    to: '/sql/sql-functions/geospatial-functions/h3-to-geo'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-to-parent',
    to: '/sql/sql-functions/geospatial-functions/h3-to-parent'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-to-string',
    to: '/sql/sql-functions/geospatial-functions/h3-to-string'
  },
  {
    from: '/sql/sql-functions/geometry-functions/h3-unidirectional-edge-is-valid',
    to: '/sql/sql-functions/geospatial-functions/h3-unidirectional-edge-is-valid'
  },
  {
    from: '/sql/sql-functions/geometry-functions/haversine',
    to: '/sql/sql-functions/geospatial-functions/haversine'
  },
  {
    from: '/sql/sql-functions/geometry-functions/point-in-polygon',
    to: '/sql/sql-functions/geospatial-functions/point-in-polygon'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-asbinary',
    to: '/sql/sql-functions/geospatial-functions/st-asbinary'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-asewkb',
    to: '/sql/sql-functions/geospatial-functions/st-asewkb'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-asewkt',
    to: '/sql/sql-functions/geospatial-functions/st-asewkt'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-asgeojson',
    to: '/sql/sql-functions/geospatial-functions/st-asgeojson'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-astext',
    to: '/sql/sql-functions/geospatial-functions/st-astext'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-aswkb',
    to: '/sql/sql-functions/geospatial-functions/st-aswkb'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-aswkt',
    to: '/sql/sql-functions/geospatial-functions/st-aswkt'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-contains',
    to: '/sql/sql-functions/geospatial-functions/st-contains'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-dimension',
    to: '/sql/sql-functions/geospatial-functions/st-dimension'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-distance',
    to: '/sql/sql-functions/geospatial-functions/st-distance'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-endpoint',
    to: '/sql/sql-functions/geospatial-functions/st-endpoint'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geohash',
    to: '/sql/sql-functions/geospatial-functions/st-geohash'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geom-point',
    to: '/sql/sql-functions/geospatial-functions/st-geom-point'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geometryfromewkb',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromewkb'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geometryfromewkt',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromewkt'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geometryfromtext',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromtext'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geometryfromwkb',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromwkb'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geometryfromwkt',
    to: '/sql/sql-functions/geospatial-functions/st-geometryfromwkt'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geomfromewkb',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromewkb'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geomfromewkt',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromewkt'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geomfromgeohash',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromgeohash'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geomfromtext',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromtext'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geomfromwkb',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromwkb'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geomfromwkt',
    to: '/sql/sql-functions/geospatial-functions/st-geomfromwkt'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-geompointfromgeohash',
    to: '/sql/sql-functions/geospatial-functions/st-geompointfromgeohash'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-length',
    to: '/sql/sql-functions/geospatial-functions/st-length'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-make-line',
    to: '/sql/sql-functions/geospatial-functions/st-make-line'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-makegeompoint',
    to: '/sql/sql-functions/geospatial-functions/st-makegeompoint'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-makeline',
    to: '/sql/sql-functions/geospatial-functions/st-makeline'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-makepolygon',
    to: '/sql/sql-functions/geospatial-functions/st-makepolygon'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-npoints',
    to: '/sql/sql-functions/geospatial-functions/st-npoints'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-numpoints',
    to: '/sql/sql-functions/geospatial-functions/st-numpoints'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-pointn',
    to: '/sql/sql-functions/geospatial-functions/st-pointn'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-polygon',
    to: '/sql/sql-functions/geospatial-functions/st-polygon'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-setsrid',
    to: '/sql/sql-functions/geospatial-functions/st-setsrid'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-srid',
    to: '/sql/sql-functions/geospatial-functions/st-srid'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-startpoint',
    to: '/sql/sql-functions/geospatial-functions/st-startpoint'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-transform',
    to: '/sql/sql-functions/geospatial-functions/st-transform'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-x',
    to: '/sql/sql-functions/geospatial-functions/st-x'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-xmax',
    to: '/sql/sql-functions/geospatial-functions/st-xmax'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-xmin',
    to: '/sql/sql-functions/geospatial-functions/st-xmin'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-y',
    to: '/sql/sql-functions/geospatial-functions/st-y'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-ymax',
    to: '/sql/sql-functions/geospatial-functions/st-ymax'
  },
  {
    from: '/sql/sql-functions/geometry-functions/st-ymin',
    to: '/sql/sql-functions/geospatial-functions/st-ymin'
  },
  {
    from: '/sql/sql-functions/geometry-functions/string-to-h3',
    to: '/sql/sql-functions/geospatial-functions/string-to-h3'
  },
  {
    from: '/sql/sql-functions/geometry-functions/to-geometry',
    to: '/sql/sql-functions/geospatial-functions/to-geometry'
  },
  {
    from: '/sql/sql-functions/geometry-functions/to-string',
    to: '/sql/sql-functions/geospatial-functions/to-string'
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
  },
  // loading data
  {
    from: '/guides/load-data/transform/querying-metadata',
    to: '/tutorials/load/query-metadata'
  },
  // Query guide restructuring - moved from flat to hierarchical structure
  {
    from: '/guides/query/filtering-selection',
    to: '/guides/query/basics/filtering-selection'
  },
  {
    from: '/guides/query/aggregating-data',
    to: '/guides/query/basics/aggregating-data'
  },
  {
    from: '/guides/query/joins',
    to: '/guides/query/combining-data/joins'
  },
  {
    from: '/guides/query/cte',
    to: '/guides/query/combining-data/cte'
  },
  {
    from: '/guides/query/udf',
    to: '/guides/query/advanced/udf'
  },
  {
    from: '/guides/query/external-function',
    to: '/guides/query/advanced/external-function'
  },
  {
    from: '/guides/query/stored-procedure',
    to: '/guides/query/advanced/stored-procedure'
  },
  {
    from: '/guides/query/sequences',
    to: '/guides/query/advanced/sequences'
  },
  {
    from: '/guides/query/query-profile',
    to: '/guides/query/optimization/query-profile'
  },
  {
    from: '/guides/query/query-hash',
    to: '/guides/query/optimization/query-hash'
  },
  // Dictionary page removed - redirect to advanced features index
  {
    from: '/guides/query/dictionary',
    to: '/guides/query/advanced/'
  },
  // ANY function redirect to ANY_VALUE
  {
    from: '/sql/sql-functions/aggregate-functions/aggregate-any',
    to: '/sql/sql-functions/aggregate-functions/aggregate-any-value'
  }
];
export default siteRedirects;
