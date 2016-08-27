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

const listFirst = () => list.first();
const arrayZeroIndex = () => data[0]; // so we can see the function call overhead
const underscoreFirst = () => underscore.first(data);
const lodashFirst = () => lodash.first(data);
const iterableFirst = () => iterable.first();
const lazyFirst = () => lazy.first();
const ramdaHead = () => ramda.head(data);

run('first', {
  'List#first()': listFirst,
  'Array[0]': arrayZeroIndex,
  'Underscore.first()': underscoreFirst,
  'Lodash.first()': lodashFirst,
  'Iterable#first()': iterableFirst,
  'Lazy#first()': lazyFirst,
  'Ramda.head()': ramdaHead
});
