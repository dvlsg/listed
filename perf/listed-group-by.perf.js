"use strict";

const data = require('./util/data');
const run = require('./util/run');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');

const grouper = obj => obj.color;

const listGroupBy = (input) => () => input.groupBy(grouper);
const lodashGroupBy = (input) => () => lodash.groupBy(input, grouper);
const underscoreGroupBy = (input) => () => underscore.groupBy(input, grouper);
const iterablejsGroup = (input) => () => input.group(grouper).toArray();
const lazyGroupBy = (input) => () => input.groupBy(grouper).toArray();
const ramdaGroupBy = (input) => () => ramda.groupBy(grouper, input);

const sizes = [
  10,
  100,
  1000
];

const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));
const iterable = (size) => iter(take(size));
const lazy = (size) => new Lazy(take(size));

const methods = [
  { name: 'List#groupBy()', method: listGroupBy, provider: list },
  { name: 'Lodash.groupBy()', method: lodashGroupBy, provider: take },
  { name: 'Underscore.groupBy()', method: underscoreGroupBy, provider: take },
  { name: 'Ramda.groupBy()', method: ramdaGroupBy, provider: take },
  { name: 'Iterable#group()', method: iterablejsGroup, provider: iterable },
  { name: 'Lazy#groupBy()', method: lazyGroupBy, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `groupBy (${size})`;
  for (let { name, method, provider } of methods) {
    // our output is slightly different (not an object),
    // so let's trust the actual unit tests are sufficient
    // for determining we are receiving what we expect
    let benchMethod = method(provider(size));
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
