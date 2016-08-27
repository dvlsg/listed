"use strict";

const run = require('./util/run');
const data = require('./util/data');
const { assert } = require('chai');

const { List } = require('../');
const { iter } = require('iterablejs');
const lodash = require('lodash');
// no real equivalent in underscore

const small = 5;
const medium = 50;
const large = 500;
const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));
const iterable = (size) => iter(take(size));

function listOrderBy(input) {
  return () => {
    let ordered = input.orderBy(
      [ x => x.color ],
      [ 'value', -1 ]
    );
    return ordered;
  };
}

function lodashOrderBy(input) {
  return function() {
    let ordered = lodash.orderBy(
      input,
      [ 'color', 'value' ],
      [ 'asc', 'desc' ]
    );
    return ordered;
  };
}

function iterableOrderBy(input) {
  return function() {
    let ordered = input
      .orderBy(x => x.color)
      .thenByDescending(x => x.value)
      .toArray();
    return ordered;
  };
}

assert.deepEqual(listOrderBy(list(small))(), List.from(lodashOrderBy(take(small))()));
assert.deepEqual(listOrderBy(list(small))(), List.from(iterableOrderBy(iterable(small))()));
assert.deepEqual(listOrderBy(list(medium))(), List.from(lodashOrderBy(take(medium))()));
assert.deepEqual(listOrderBy(list(medium))(), List.from(iterableOrderBy(iterable(medium))()));
assert.deepEqual(listOrderBy(list(large))(), List.from(lodashOrderBy(take(large))()));
assert.deepEqual(listOrderBy(list(large))(), List.from(iterableOrderBy(iterable(large))()));

run('orderBy (small)', {
  'List#orderBy()': listOrderBy(list(small)),
  'Lodash.orderBy()': lodashOrderBy(take(small)),
  'Iterable#orderBy()': iterableOrderBy(iterable(small))
});

run('orderBy (medium)', {
  'List#orderBy()': listOrderBy(list(medium)),
  'Lodash.orderBy()': lodashOrderBy(take(medium)),
  'Iterable#orderBy()': iterableOrderBy(iterable(medium))
});

run('orderBy (large)', {
  'List#orderBy()': listOrderBy(list(large)),
  'Lodash.orderBy()': lodashOrderBy(take(large)),
  'Iterable#orderBy()': iterableOrderBy(iterable(large))
});
