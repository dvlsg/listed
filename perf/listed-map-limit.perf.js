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

const limit = 5; // 5 max degree of parallelism.

const listMapLimit = (_list) => () => _list.mapLimit(mapperAsync, limit);
const bluebirdMapLimit = (_bluebird) => () => _bluebird.map(mapperAsync, { concurrency: limit });

// how much do we keep? should keep timeout(0) for sure, but the `co` / generator overhead is ignored.
// probably best this way, it's the most similar to an actual use case (i think)
const asyncIteratee = (elem, callback) => timeout(0).then(() => callback(null, `Doubled Value: ${elem.value * 2}`));
const asyncMapLimit = (arr) => () => {
  // wrap in a promise so benchr handles it as expected.
  // this is additional overhead: are we being disingenuous?
  return new Promise((resolve, reject) => {
    async.mapLimit(
      arr,
      limit,
      asyncIteratee,
      (err, mapped) => {
        if (err) {
          return reject(err);
        }
        return resolve(mapped);
      }
    );
  });
};

suite('Map Limit (Small)', () => {
  benchmark('List#mapLimit()', listMapLimit(list(small)));
  benchmark('Bluebird#map(limit)', bluebirdMapLimit(bluebird(small)));
  benchmark('async.mapLimit()', asyncMapLimit(small));
});
suite('Map Limit (Medium)', () => {
  benchmark('List#mapLimit()', listMapLimit(list(medium)));
  benchmark('Bluebird#map(limit)', bluebirdMapLimit(bluebird(medium)));
  benchmark('async.mapLimit()', asyncMapLimit(medium));
});
suite('Map Limit (Large)', () => {
  benchmark('List#mapLimit()', listMapLimit(list(large)));
  benchmark('Bluebird#map(limit)', bluebirdMapLimit(bluebird(large)));
  benchmark('async.mapLimit()', asyncMapLimit(large));
});
