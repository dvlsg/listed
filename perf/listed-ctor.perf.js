"use strict";

const run = require('./util/run');
const fill = require('./util/fill');
const { List } = require('../');

let args = fill(0, 500);

function listConstructor() {
  return new List(...args);
}

function arrayConstructor() {
  return new Array(...args);
}

function arrayLiteral() {
  return [ ...args ];
}

// the spread is redundant with .from(),
// but lets keep one spread per method to try
// to have the methods as similar as possible.
function listFrom() {
  return List.from([ ...args ]);
}

function arrayFrom() {
  return Array.from([ ...args ]);
}

function listOf() {
  return List.of(...args);
}

function arrayOf() {
  return Array.of(...args);
}

run('constructors', {
  'List.of()': listOf,
  'List.from()': listFrom,
  'List constructor': listConstructor,
  'Array constructor': arrayConstructor,
  'Array literal': arrayLiteral,
  'Array.from()': arrayFrom,
  'Array.of()': arrayOf
});
