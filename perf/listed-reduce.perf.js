"use strict";

const data = require('./util/data');
const run = require('./util/run');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');

const list = List.from(data);
const lazy = new Lazy(data);
const iterable = iter(data);

const reducer = (accumulator, elem) => {
  accumulator.sum += elem.value;
  return accumulator;
};

const initial = () => ({ sum: 0 });

const listReduce = () => list.reduce(reducer, initial());
const arrayReduce = () => data.reduce(reducer, initial());
const underscoreReduce = () => underscore.reduce(data, reducer, initial());
const lodashReduce = () => lodash.reduce(data, reducer, initial());
const iterableReduce = () => iterable.reduce(reducer, initial());
const lazyReduce = () => lazy.reduce(reducer, initial());
const ramdaReduce = () => ramda.reduce(reducer, initial(), data);

run('reduce', {
  'List#reduce()': listReduce,
  'Array#reduce()': arrayReduce,
  'Underscore.reduce()': underscoreReduce,
  'Lodash.reduce()': lodashReduce,
  'Iterable#reduce()': iterableReduce,
  'Lazy#reduce()': lazyReduce,
  'Ramda.reduce()': ramdaReduce
});
