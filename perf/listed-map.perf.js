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

const mapper = (obj) => `Doubled Value: ${obj.value * 2}`;

const listMap = () => list.map(mapper);
const arrayMap = () => data.map(mapper);
const underscoreMap = () => underscore.map(data, mapper);
const lodashMap = () => lodash.map(data, mapper);
const iterableMap = () => iterable.map(mapper).toArray();
const lazyMap = () => lazy.map(mapper).toArray();
const ramdaMap = () => ramda.map(mapper, data);

run('map', {
  'List#map()': listMap,
  'Array#map()': arrayMap,
  'Underscore.map()': underscoreMap,
  'Lodash.map()': lodashMap,
  'Iterable#map()': iterableMap,
  'Lazy#map()': lazyMap,
  'Ramda.map()': ramdaMap
});
