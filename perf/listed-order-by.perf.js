"use strict";

const run = require('./util/run');
const data = require('./util/data');

const { List } = require('../');
const { iter } = require('iterablejs');
const lodash = require('lodash');
// no real equivalent in underscore

let list = List.of(...data);

function listOrderBy() {
  let ordered = list.orderBy(
    [ x => x.color ],
    [ 'value', -1 ]
  );
  return ordered;
}

function lodashOrderBy() {
  let ordered = lodash.orderBy(
    data,
    [ 'color', 'value' ],
    [ 'asc', 'desc' ]
  );
  return ordered;
}

function iterableOrderBy() {
  let ordered = iter(data)
    .orderBy(x => x.color)
    .thenByDescending(x => x.value)
    .toArray();
  return ordered;
}

run('orderBy', {
  'List#orderBy()': listOrderBy,
  'Lodash.orderBy()': lodashOrderBy,
  'Iterable#orderBy()': iterableOrderBy
});
