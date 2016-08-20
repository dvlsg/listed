/* global benchmark, suite */

"use strict";

const co = require('co');
const Bluebird = require('bluebird');
const async = require('async');
const { List } = require('../');

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

const listMapSeries = (_list) => () => _list.mapSeries(mapperAsync);
const bluebirdMapSeries = (_bluebird) => () => _bluebird.mapSeries(mapperAsync);

// how much do we keep? should keep timeout(0) for sure, but the `co` / generator overhead is ignored.
// probably best this way, it's the most similar to an actual use case (i think)
const asyncMapSeriesIteratee = (elem, callback) => timeout(0).then(() => callback(null, `Doubled Value: ${elem.value * 2}`));
const asyncMapSeries = (arr) => () => {
  // wrap in a promise so benchr handles it
  // this is additional overhead: are we being disingenuous?
  return new Promise((resolve, reject) => {
    async.mapSeries(
      arr,
      asyncMapSeriesIteratee,
      (err, mapped) => {
        if (err) {
          return reject(err);
        }
        return resolve(mapped);
      }
    );
  });
};

suite('Map Series (Small)', () => {
  benchmark('List#mapSeries()', listMapSeries(list(small)));
  benchmark('Bluebird#mapSeries()', bluebirdMapSeries(bluebird(small)));
  benchmark('async.mapSeries()', asyncMapSeries(small));
});
suite('Map Series (Medium)', () => {
  benchmark('List#mapSeries()', listMapSeries(list(medium)));
  benchmark('Bluebird#mapSeries()', bluebirdMapSeries(bluebird(medium)));
  benchmark('async.mapSeries()', asyncMapSeries(medium));
});
suite('Map Series (Large)', () => {
  benchmark('List#mapSeries()', listMapSeries(list(large)));
  benchmark('Bluebird#mapSeries()', bluebirdMapSeries(bluebird(large)));
  benchmark('async.mapSeries()', asyncMapSeries(large));
});
