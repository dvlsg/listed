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

});
