"use strict";

const data = require('./util/data');
const run = require('./util/run');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');
const { assert } = require('chai');

const selector = (elem) => elem.value;
const reducer = (acc, elem) => {
  const selected = selector(elem);
  if (typeof selected === 'number' && !isNaN(selected)) {
    acc += selected;
  }
  return acc;
};

const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));
const iterable = (size) => iter(take(size));
const lazy = (size) => new Lazy(take(size));

const listAverage = (input) => () => input.average(selector);
const arrayAverage = (input) => () => input.reduce(reducer, 0) / input.length;
const lodashAverage = (input) => () => lodash.reduce(input, reducer, 0) / input.length;
const underscoreAverage = (input) => () => underscore.reduce(input, reducer, 0) / input.length;
const ramdaAverage = (input) => () => ramda.sum(ramda.map(selector, input)) / input.length;
const iterableAverage = (input) => () => input.average(selector);
const lazyAverage = (input) => () => input.sum(selector) / input.toArray().length;

const sizes = [
  10,
  100,
  1000
];

const methods = [
  { name: 'List#average()', method: listAverage, provider: list },
  { name: 'Array average', method: arrayAverage, provider: take },
  { name: 'Lodash average', method: lodashAverage, provider: take },
  { name: 'Underscore average', method: underscoreAverage, provider: take },
  { name: 'Ramda.average()', method: ramdaAverage, provider: take },
  { name: 'Iterable#average()', method: iterableAverage, provider: iterable },
  { name: 'Lazy average()', method: lazyAverage, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `average (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listAverage(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = benchMethod();
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
