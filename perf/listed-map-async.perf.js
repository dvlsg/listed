"use strict";

/* global benchmark, suite */

const co = require('co');
const Bluebird = require('bluebird');
const { List } = require('../');

function onCycle(event) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(String(event.target));
}

const data = require('./util/data');
const timeout = require('./util/timeout');

const small = data.slice(0, 10);
const medium = data.slice(0, 100);
const large = data.slice(0, 1000);

const list = (input) => List.from(input);
const bluebird = (input) => Bluebird.resolve(input);

const mapperAsync = (elem) => co(function*() {
  yield timeout(0);
  return `Doubled Value: ${elem.value * 2}`;
});

const listMapAsync = (_list) => () => _list.mapAsync(mapperAsync);
const bluebirdMap = (_bluebird) => () => _bluebird.map(mapperAsync);

suite('Map Async (Small)', { onCycle },  () => {
  benchmark('List#mapAsync()', listMapAsync(list(small)));
  benchmark('Bluebird#map()', bluebirdMap(bluebird(small)));
});
suite('Map Async (Medium)', () => {
  benchmark('List#mapAsync()', listMapAsync(list(medium)));
  benchmark('Bluebird#map()', bluebirdMap(bluebird(medium)));
});
suite('Map Async (Large)', () => {
  benchmark('List#mapAsync()', listMapAsync(list(large)));
  benchmark('Bluebird#map()', bluebirdMap(bluebird(large)));
});
