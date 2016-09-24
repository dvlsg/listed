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

const listSum = (input) => () => input.sum(selector);
const arraySum = (input) => () => input.reduce(reducer, 0);
const lodashSum = (input) => () => lodash.reduce(input, reducer, 0);
const underscoreSum = (input) => () => underscore.reduce(input, reducer, 0);
const ramdaSum = (input) => () => ramda.sum(ramda.map(selector, input));
const iterableSum = (input) => () => input.sum(selector);
const lazySum = (input) => () => input.sum(selector);

const sizes = [
  10,
  100,
  1000
];

const methods = [
  { name: 'List#sum()', method: listSum, provider: list },
  { name: 'Array sum', method: arraySum, provider: take },
  { name: 'Lodash sum', method: lodashSum, provider: take },
  { name: 'Underscore sum', method: underscoreSum, provider: take },
  { name: 'Ramda.sum()', method: ramdaSum, provider: take },
  { name: 'Iterable#sum()', method: iterableSum, provider: iterable },
  { name: 'Lazy#sum()', method: lazySum, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `sum (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listSum(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = benchMethod();
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
