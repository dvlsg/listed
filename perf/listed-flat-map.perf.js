"use strict";

const data = require('./util/data');
const run = require('./util/run');
const { assert } = require('chai');

const { List } = require('../');
const lodash = require('lodash');
const ramda = require('ramda');

const duplicator = (obj) => [ obj.value, obj.value ];

const listFlatMap = (input) => () => input.flatMap(duplicator);
const lodashFlatMap = (input) => () => lodash.flatMap(input, duplicator);
const ramdaChain = (input) => () => ramda.chain(duplicator, input);

const sizes = [
  10,
  100,
  1000
];

const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));

const methods = [
  { name: 'List#flatMap()', method: listFlatMap, provider: list },
  { name: 'Lodash.flatMap()', method: lodashFlatMap, provider: take },
  { name: 'Ramda.chain()', method: ramdaChain, provider: take }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `flatMap (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listFlatMap(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = List.from(benchMethod());
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
