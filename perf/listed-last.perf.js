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

const listLast = () => list.last();
const arrayLastIndex = () => data[data.length - 1]; // so we can see the function call overhead
const underscoreLast = () => underscore.last(data);
const lodashLast = () => lodash.last(data);
const iterableLast = () => iterable.last();
const lazyLast = () => lazy.last();
const ramdaLast = () => ramda.last(data);

run('last', {
  'List#last()': listLast,
  'Array[length - 1]': arrayLastIndex,
  'Underscore.last()': underscoreLast,
  'Lodash.last()': lodashLast,
  'Iterable#last()': iterableLast,
  'Lazy#last()': lazyLast,
  'Ramda.last()': ramdaLast
});
