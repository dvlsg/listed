"use strict";

const { List } = require('../');
const { assert } = require('chai');

describe('List', () => {

  describe('constructor', () => {
    it('should return instanceof List', () => {
      let list = new List();
      assert.instanceOf(list, List);
    });

    it('should return instanceof Array', () => {
      let list = new List();
      assert.instanceOf(list, Array);
    });

    it('should set length with single number argument', () => {
      let list = new List(5);
      assert.equal(list.length, 5);
    });

    it('should set first element with single non-number arguments', () => {
      let actual = new List('1');
      let expected = List.of('1');
      assert.deepEqual(actual, expected);
    });

    it('should set multiple arguments as elements', () => {
      let actual = new List(1, 2, 3, 4, 5);
      let expected = List.of(1, 2, 3, 4, 5);
      assert.equal(actual.length, 5);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#[Symbol.toStringTag]()', () => {
    it('should return List', () => {
      let list = new List();
      let actual = Object.prototype.toString.call(list);
      let expected = '[object List]';
      assert.equal(actual, expected);
    });
  });

  describe('.from()', () => {
    it('should return instanceof List', () => {
      let list = List.from([]);
      assert.instanceOf(list, List);
    });

    it('should throw on empty arguments', () => {
      assert.throws(() => List.from());
    });

    it('should accept an array argument', () => {
      let actual = List.from([ 1, 2, 3 ]);
      let expected = List.of(1, 2, 3);
      assert.deepEqual(actual, expected);
    });

    it('should accept a list argument', () => {
      let expected = List.of(1, 2, 3);
      let actual = List.from(expected);
      assert.notStrictEqual(actual, expected);
      assert.deepEqual(actual, expected);
    });

    it('should accept an array-like argument', () => {
      let input = { 0: 1, 1: 2, 2: 3, length: 3 };
      let actual = List.from(input);
      let expected = List.of(1, 2, 3);
      assert.deepEqual(actual, expected);
    });
  });

  describe('.of()', () => {
    it('should return instanceof List', () => {
      let list = List.of();
      assert.instanceOf(list, List);
    });

    it('should set single number argument as first element', () => {
      let actual = List.of(1);
      let expected = List.from([ 1 ]);
      assert.deepEqual(actual, expected);
    });

    it('should accept multiple arguments', () => {
      let actual = List.of(undefined, null, 0, false, '');
      let expected = List.from([ undefined, null, 0, false, '' ]);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#filter()', () => {
    it('should return a new List', () => {
      let list = List.of(1, 2, 3);
      let filtered = list.filter(x => x > 1);
      assert.instanceOf(filtered, List);
      assert.notStrictEqual(list, filtered);
      assert.notDeepEqual(list, filtered);
    });

    it('should filter by a given predicate', () => {
      let list = List.of(1, 2, 3);
      let actual = list.filter(x => x > 1);
      let expected = List.of(2, 3);
      assert.deepEqual(actual, expected);
    });

    it('should provide index to the predicate', () => {
      let list = List.of(1, 2, 3);
      let actual = list.filter((x, i) => i > 1);
      let expected = List.of(3);
      assert.deepEqual(actual, expected);
    });

    it('should use identity fn by default', () => {
      let list = List.of(0, 1, 2, null, undefined, '', 3);
      let actual = list.filter();
      let expected = List.of(1, 2, 3);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#map()', () => {
    it('should return a new List', () => {
      let list = List.of(1, 2, 3);
      let mapped = list.map(x => x);
      assert.notStrictEqual(list, mapped);
      assert.deepEqual(list, mapped);
      assert.instanceOf(mapped, List);
    });

    it('should accept a transformer', () => {
      let list = List.of(1, 2, 3);
      let actual = list.map(x => x + 1);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    });

    it('should use identity fn as a default', () => {
      let list = List.of(1, null, undefined, 4);
      let actual = list.map();
      let expected = List.of(1, null, undefined, 4);
      assert.deepEqual(actual, expected);
    });
  });

});
