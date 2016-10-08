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

const rAny = ramda.any(predicate); // build the function ahead of time.

const listAny = (input) => () => input.any(predicate);
const arraySome = (input) => () => input.some(predicate);
const lodashSome = (input) => () => lodash.some(input, predicate);
const underscoreSome = (input) => () => underscore.some(input, predicate);
const ramdaAny = (input) => () => rAny(input);
const iterableAny = (input) => () => input.any(predicate);
const lazySome = (input) => () => input.some(predicate);

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
  { name: 'List#any()', method: listAny, provider: list },
  { name: 'Array#some()', method: arraySome, provider: take },
  { name: 'Lodash.some()', method: lodashSome, provider: take },
  { name: 'Underscore.some()', method: underscoreSome, provider: take },
  { name: 'Ramda.any()', method: ramdaAny, provider: take },
  { name: 'Iterable#any()', method: iterableAny, provider: iterable },
  { name: 'Lazy#some()', method: lazySome, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `any (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listAny(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = benchMethod();
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
