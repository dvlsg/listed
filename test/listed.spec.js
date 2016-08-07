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

    it('should accept an iterable argument', () => {
      let map = new Map([ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]);
      let actual = List.from(map);
      let expected = List.of([ 1, 1 ], [ 2, 2 ], [ 3, 3 ]);
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

  describe('#concat()', () => {
    it('should return a new List', () => {
      let list = List.of(1, 2, 3);
      let concat = list.concat();
      assert.notStrictEqual(list, concat);
      assert.instanceOf(concat, List);
    });

    it('should concatenate two lists', () => {
      let list1 = List.of(1, 2);
      let list2 = List.of(3, 4);
      let actual = list1.concat(list2);
      let expected = List.of(1, 2, 3, 4);
      assert.deepEqual(actual, expected);
    });

    it('should concatenate multiple lists', () => {
      let list1 = List.of(1, 2);
      let list2 = List.of(3, 4);
      let list3 = List.of(5, 6);
      let list4 = List.of(7, 8);
      let actual = list1.concat(list2, list3, list4);
      let expected = List.of(1, 2, 3, 4, 5, 6, 7, 8);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#every()', () => {
    it('should return true when all elements pass a given predicate', () => {
      let list = List.of(1, 2, 3);
      let every = list.every(x => typeof x === 'number');
      assert.isTrue(every);
    });

    it('should return false when one element fails a given predicate', () => {
      let list = List.of(1, 2, '3');
      let every = list.every(x => typeof x === 'number');
      assert.isFalse(every);
    });

    it('should provide index to the predicate', () => {
      let list = List.of(1, 2, 3);
      list.every((elem, index) => {
        assert.strictEqual(elem, index + 1);
      });
    });

    it('should provide List reference to the predicate', () => {
      let list = List.of(1, 2, 3);
      list.every((elem, index, listRef) => {
        assert.strictEqual(list, listRef);
      });
    });

    it('should use identity fn as default predicate', () => {
      let list = List.of(1, 2, 3);
      let every = list.every();
      assert.isTrue(every);
      list.push(null);
      every = list.every();
      assert.isFalse(every);
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

    it('should provide List reference to the predicate', () => {
      let list = List.of(1, 2, 3);
      list.filter((elem, index, listRef) => {
        assert.strictEqual(list, listRef);
      });
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

    it('should provide index to transformer', () => {
      let list = List.of(1, 2, 3);
      let actual = list.map((x, i) => x + i);
      let expected = List.of(1, 3, 5);
      assert.deepEqual(actual, expected);
    });

    it('should provide List reference to the transformer', () => {
      let list = List.of(1, 2, 3);
      list.map((elem, index, listRef) => {
        assert.strictEqual(list, listRef);
      });
    });

    it('should use identity fn as a default', () => {
      let list = List.of(1, null, undefined, 4);
      let actual = list.map();
      let expected = List.of(1, null, undefined, 4);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#reduce', () => {
    it('should reduce a List into a single value', () => {
      let list = List.of(1, 2, 3, 4);
      let actual = list.reduce((accumulator, elem) => accumulator + elem, 5);
      let expected = 15;
      assert.equal(actual, expected);
    });

    it('should optionally use the first value as a seed', () => {
      let list = List.of(1, 2, 3, 4);
      let actual = list.reduce((accumulator, elem) => accumulator + elem);
      let expected = 10;
      assert.equal(actual, expected);
    });

    it('should provide index to the reducer', () => {
      let list = List.of(1, 2, 3, 4);
      list.reduce((accumulator, elem, index) => {
        assert.equal(elem, index + 1);
      });
    });

    it('should provide List reference to the reducer', () => {
      let list = List.of(1, 2, 3, 4);
      list.reduce((accumulator, elem, index, listRef) => {
        assert.strictEqual(list, listRef);
      });
    });
  });

});
