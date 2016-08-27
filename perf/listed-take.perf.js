"use strict";

const data = require('./util/data');
const run = require('./util/run');
const entries = require('./util/entries');
const { assert } = require('chai');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');

const list = List.from(data);
const iterable = iter(data);
const lazy = new Lazy(data);

const listTake = (count) => () => list.take(count);
const arraySlice = (count) => () => data.slice(0, count);
const lodashTake = (count) => () => lodash.take(data, count);
const underscoreTake = (count) => () => underscore.take(data, count);
const ramdaTake = (count) => () => ramda.take(count, data);
const iterableTake = (count) => () => iterable.take(count).toArray();
const lazyTake = (count) => () => lazy.take(count).toArray();

const sizes = [
  10,
  100,
  1000
];

const methods = {
  'List#take()': listTake,
  'Array#slice()': arraySlice,
  'Lodash.take()': lodashTake,
  'Underscore.take()': underscoreTake,
  'Ramda.take()': ramdaTake,
  'Iterable#take()': iterableTake,
  'Lazy#take()': lazyTake
};

for (let size of sizes) {
  const definitions = {};
  const definitionName = `take (${size})`;
  for (let [ methodName, method ] of entries(methods)) {
    assert.deepEqual(listTake(size)(), List.from(method(size)()));
    definitions[methodName] = method(size);
  }
  run(definitionName, definitions);
}
