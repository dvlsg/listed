"use strict";

const data = require('./util/data');
const run = require('./util/run');
const { assert } = require('chai');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const ramda = require('ramda');


const predicate = obj => obj.value !== 9;
const rTakeWhile = ramda.takeWhile(predicate);

const listTakeWhile = (input) => () => input.takeWhile(predicate);
const lodashTakeWhile = (input) => () => lodash.takeWhile(input, predicate);
const ramdaTakeWhile = (input) => () => rTakeWhile(input);
const iterableWhile = (input) => () => input.while(predicate).toArray();
const lazyTakeWhile = (input) => () => input.takeWhile(predicate).toArray();

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
  { name: 'List#takeWhile()', method: listTakeWhile, provider: list },
  { name: 'Lodash.takeWhile()', method: lodashTakeWhile, provider: take },
  { name: 'Ramda.takeWhile()', method: ramdaTakeWhile, provider: take },
  { name: 'Iterable#while()', method: iterableWhile, provider: iterable },
  { name: 'Lazy#takeWhile()', method: lazyTakeWhile, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `takeWhile (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listTakeWhile(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = List.from(benchMethod());
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
