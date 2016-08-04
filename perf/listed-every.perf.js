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

const predicate = (obj) => obj.date < '2016-10-13T11:32:24Z';

const listEvery = () => list.every(predicate);
const arrayEvery = () => data.every(predicate);
const underscoreEvery = () => underscore.every(data, predicate);
const lodashEvery = () => lodash.every(data, predicate);
const iterableEvery = () => iterable.every(predicate);
const lazyEvery = () => lazy.every(predicate);
const ramdaAll = () => ramda.all(predicate, data);

run('filter', {
  'List#every()': listEvery,
  'Array#every()': arrayEvery,
  'Underscore.every()': underscoreEvery,
  'Lodash.every()': lodashEvery,
  'Iterable#every()': iterableEvery,
  'Lazy#every()': lazyEvery,
  'Ramda.all()': ramdaAll
});
