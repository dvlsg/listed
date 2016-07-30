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

const predicate = (obj) => obj.value > 5;

const listFilter = () => list.filter(predicate);
const arrayFilter = () => data.filter(predicate);
const underscoreFilter = () => underscore.filter(data, predicate);
const lodashFilter = () => lodash.filter(data, predicate);
const iterableFilter = () => iterable.filter(predicate).toArray();
const lazyFilter = () => lazy.filter(predicate).toArray();
const ramdaFilter = () => ramda.filter(predicate, data);

run('map', {
  'List#filter()': listFilter,
  'Array#filter()': arrayFilter,
  'Underscore.filter()': underscoreFilter,
  'Lodash.filter()': lodashFilter,
  'Iterable#filter()': iterableFilter,
  'Lazy#filter()': lazyFilter,
  'Ramda.filter()': ramdaFilter
});
