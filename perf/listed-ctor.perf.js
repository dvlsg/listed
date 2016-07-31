"use strict";

const run = require('./util/run');
const fill = require('./util/fill');
const { List } = require('../');

const args = fill(0, 500);

const listConstructor = () => new List(...args);
const arrayConstructor = () => new Array(...args);
const arrayLiteral = () => [ ...args ];

// the spread is redundant with .from(),
// but lets keep one spread per method to try
// to have the methods as similar as possible.
const listFromArraylike = () => List.from([ ...args ]);
const listFromIterable = () => List.from([ ...args ][Symbol.iterator]());
const arrayFrom = () => Array.from([ ...args ]);
const listOf = () => List.of(...args);
const arrayOf = () => Array.of(...args);

run('constructors', {
  'List.from(arraylike)': listFromArraylike,
  'List.from(iterable)': listFromIterable,
  'List.of()': listOf,
  'List constructor': listConstructor,
  'Array constructor': arrayConstructor,
  'Array literal': arrayLiteral,
  'Array.from()': arrayFrom,
  'Array.of()': arrayOf
});
