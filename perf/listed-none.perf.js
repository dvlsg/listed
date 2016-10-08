"use strict";

const data = require('./util/data');
const run = require('./util/run');
const { assert } = require('chai');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');

const predicate = obj => obj.value === 9;

const listNone = (input) => () => input.none(predicate);
const notArraySome = (input) => () => !input.some(predicate);
const notLodashSome = (input) => () => !lodash.some(input, predicate);
const notUnderscoreSome = (input) => () => !underscore.some(input, predicate);
const ramdaNone = (input) => () => ramda.none(predicate, input);
const notIterableAny = (input) => () => !input.any(predicate);
const lazyNone = (input) => () => input.none(predicate);

const sizes = [
  10,
  100,
  1000
];

const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));
const iterable = (size) => iter(take(size));
const lazy = (size) => new Lazy(take(size));

const methods = [
  { name: 'List#none()', method: listNone, provider: list },
  { name: '!Array#some()', method: notArraySome, provider: take },
  { name: '!Lodash.some()', method: notLodashSome, provider: take },
  { name: '!Underscore.some()', method: notUnderscoreSome, provider: take },
  { name: 'Ramda.none()', method: ramdaNone, provider: take },
  { name: '!Iterable#any()', method: notIterableAny, provider: iterable },
  { name: 'Lazy#none()', method: lazyNone, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `none (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listNone(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = benchMethod();
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
