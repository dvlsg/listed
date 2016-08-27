"use strict";

const data = require('./util/data');
const run = require('./util/run');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');

const colors = data.map(x => x.color);
const list = List.from(colors);
const iterable = iter(colors);
const lazy = new Lazy(colors);

const listUnique = () => list.unique();
const iterableUnique = () => iterable.unique().toArray();
const lodashUniq = () => lodash.uniq(colors);
const underscoreUniq = () => underscore.uniq(colors);
const ramdaUniq = () => ramda.uniq(colors);
const lazyUniq = () => lazy.uniq().toArray();

run('unique', {
  'List#unique()': listUnique,
  'Iterable#unique()': iterableUnique,
  'Lodash.uniq()': lodashUniq,
  'Underscore.uniq()': underscoreUniq,
  'Ramda.uniq()': ramdaUniq,
  'Lazy.unique()': lazyUniq
});
