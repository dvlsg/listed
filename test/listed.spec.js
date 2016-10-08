"use strict";

const { List, ListPromise, GroupedList } = require('../');
const co = require('co');
const { assert } = require('chai');

const sleep = (delay = 0) => new Promise((resolve) => {
  setTimeout(resolve, delay);
});

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

  describe('#all()', () => {
    it('should be an alias for #every()', () => {
      assert.strictEqual(List.prototype.all, List.prototype.every);
    });
  });

  describe('#any()', () => {
    it('should return true when any elements pass a given predicate', () => {
      let list = List.of(1, 2, 3, 4);
      let any = list.any(x => x > 3);
      assert.isTrue(any);
    });

    it('should return false when all elements fail a given predicate', () => {
      let list = List.of(1, 2, 3, 4);
      let any = list.any(x => x > 4);
      assert.isFalse(any);
    });

    it('should use the identity function as a default predicate', () => {
      let list = List.of(null, undefined, 0, '');
      let any = list.any();
      assert.isFalse(any);
    });

    it('should return false for empty lists', () => {
      let list = List.of();
      let any = list.any(() => true);
      assert.isFalse(any);
    });
  });

  describe('#average()', () => {
    it('should return the average of all elements', () => {
      let list = List.of(1, 2, 3, 4);
      let actual = list.average();
      let expected = (1 + 2 + 3 + 4) / 4;
      assert.strictEqual(actual, expected);
    });

    it('should consider all non-numbers to be 0', () => {
      let list = List.of(1, 2, undefined, '3', 4);
      let actual = list.average();
      let expected = (1 + 2 + 0 + 0 + 4) / 5;
      assert.strictEqual(actual, expected);
    });

    it('should return NaN from an empty List', () => {
      let list = List.of();
      let average = list.average();
      assert.isNaN(average);
    });

    it('should use a provided selector', () => {
      let list = List.of(
        { id: 1, value: 3 },
        { id: 2, value: 4 },
        { id: 3, value: 1 },
        { id: 4, value: 2 },
        { id: 5, value: 5 }
      );
      let actual = list.average(elem => elem.value);
      let expected = (3 + 4 + 1 + 2 + 5) / 5;
      assert.strictEqual(actual, expected);
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

    it('should return true from an empty list', () => {
      let list = List.of();
      let every = list.every();
      assert.isTrue(every);
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

  describe('#first()', () => {
    it('should return the first element', () => {
      let list = List.of(1, 2, 3);
      let actual = list.first();
      let expected = 1;
      assert.strictEqual(actual, expected);
    });

    it('should return undefined from empty list', () => {
      let list = new List();
      let actual = list.first();
      let expected = undefined; // eslint-disable-line no-undef-init
      assert.strictEqual(actual, expected);
    });
  });

  describe('#flatMap()', () => {
    it('should return a new List', () => {
      let list = new List();
      let flat = list.flatMap();
      assert.notStrictEqual(list, flat);
      assert.instanceOf(flat, List);
    });

    it('should map then flatten the results', () => {
      let list = List.of(1, 2, 3);
      let duplicate = x => [ x, x ];
      let actual = list.flatMap(duplicate);
      let expected = List.of(1, 1, 2, 2, 3, 3);
      assert.deepEqual(actual, expected);
    });

    it('should only flatten one level', () => {
      let list = List.of(1, 2, 3);
      let nest = x => List.of(x, List.of(x));
      let actual = list.flatMap(nest);
      let expected = List.of(1, List.of(1), 2, List.of(2), 3, List.of(3));
      assert.deepEqual(actual, expected);
    });

    it('should be associative', () => {
      let duplicate = x => List.of(x, x);
      let triplicate = x => List.of(x, x, x);
      let list = List.of(1, 2, 3);
      let first = list.flatMap(duplicate).flatMap(triplicate);
      let second = list.flatMap(x => duplicate(x).flatMap(triplicate));
      assert.deepEqual(first, second);
    });
  });

  describe('#flatten()', () => {
    it('should return a new List', () => {
      let list = new List();
      let flat = list.flatten();
      assert.notStrictEqual(list, flat);
      assert.instanceOf(flat, List);
    });

    it('should flatten nested lists', () => {
      let list = new List(1, 2, new List(3, 4, 5));
      let actual = list.flatten();
      let expected = new List(1, 2, 3, 4, 5);
      assert.deepEqual(actual, expected);
    });

    it('should work with arrays', () => {
      let list = new List(1, 2, [ 3, 4, 5 ]);
      let actual = list.flatten();
      let expected = new List(1, 2, 3, 4, 5);
      assert.deepEqual(actual, expected);
    });

    it('should only flatten one level by default', () => {
      let list = new List(1, [ 2, 3, [ 4, 5 ] ]);
      let actual = list.flatten();
      let expected = new List(1, 2, 3, [ 4, 5 ]);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#groupBy()', () => {
    it('should group by a given selector', () => {
      let list = new List(
        { id: 1, type: 'a', val: 5 },
        { id: 2, type: 'a', val: 6 },
        { id: 3, type: 'b', val: 7 },
        { id: 4, type: 'b', val: 8 }
      );
      let actual = list.groupBy(x => x.type);
      let expected = new List(
        GroupedList.of(
          { id: 1, type: 'a', val: 5 },
          { id: 2, type: 'a', val: 6 }
        ),
        GroupedList.of(
          { id: 3, type: 'b', val: 7 },
          { id: 4, type: 'b', val: 8 }
        )
      );
      expected[0].key = 'a';
      expected[1].key = 'b';
      assert.deepEqual(actual, expected);
    });

    it('should convert given string to selector', () => {
      let list = new List(
        { id: 1, type: 'a', val: 5 },
        { id: 2, type: 'a', val: 6 },
        { id: 3, type: 'b', val: 7 },
        { id: 4, type: 'b', val: 8 }
      );
      let actual = list.groupBy('type');
      let expected = new List(
        GroupedList.of(
          { id: 1, type: 'a', val: 5 },
          { id: 2, type: 'a', val: 6 }
        ),
        GroupedList.of(
          { id: 3, type: 'b', val: 7 },
          { id: 4, type: 'b', val: 8 }
        )
      );
      expected[0].key = 'a';
      expected[1].key = 'b';
      assert.deepEqual(actual, expected);
    });

    xit('should support integrated aggregation', () => {
      let products = List.of(
        { productId: 1, name: 'Product 1', price: 123.45 },
        { productId: 2, name: 'Product 2', price: 35.78 },
        { productId: 3, name: 'Product 3', price: 95.50 }
      );

      let sales = List.of(
        { saleId: 1, productId: 1, quantity: 1 },
        { saleId: 2, productId: 1, quantity: 5 },
        { saleId: 3, productId: 2, quantity: 4 },
        { saleId: 4, productId: 2, quantity: 2 },
        { saleId: 5, productId: 3, quantity: 1 }
      );

      let actual = sales.filter(sale => sale.quantity > 1)
        .product(products) // need to implement product before enabling this test.
        .filter(([ sale, product ]) => sale.productId === product.productId)
        .map(([ sale, product ]) => ({
          saleId: sale.saleId,
          productId: product.productId,
          quantity: sale.quantity,
          price: product.price
        }))
        .groupBy(productSale => productSale.productId)
        .map(group => ({
          productId: group.key,
          quantity: group.sum(productSale => productSale.quantity),
          amount: group.sum(productSale => productSale.quantity * productSale.price)
        }));

      let expected = new List(
        { productId: 1, quantity: 5, amount: 617.25 },
        { productId: 2, quantity: 6, amount: 214.68 }
      );
      assert.deepEqual(actual, expected);
    });
  });

  describe('#last()', () => {
    it('should return the last element', () => {
      let list = List.of(1, 2, 3);
      let actual = list.last();
      let expected = 3;
      assert.strictEqual(actual, expected);
    });

    it('should work with single item lists', () => {
      let list = List.of(1);
      let actual = list.last();
      let expected = 1;
      assert.strictEqual(actual, expected);
    });

    it('should return undefined from empty list', () => {
      let list = new List();
      let actual = list.last();
      let expected = undefined; // eslint-disable-line no-undef-init
      assert.strictEqual(actual, expected);
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

  describe('#mapAsync()', () => {
    it('should return a ListPromise<List>', () => co(function*() {
      let list = List.of(1, 2, 3);
      let promise = list.mapAsync(x => x);
      assert.instanceOf(promise, ListPromise);
      let mapped = yield promise;
      assert.notStrictEqual(list, mapped);
      assert.deepEqual(list, mapped);
      assert.instanceOf(mapped, List);
    }));

    it('should accept an async mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let mapperAsync = (elem) => co(function*() {
        yield sleep(5);
        return elem + 1;
      });
      let actual = yield list.mapAsync(mapperAsync);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should work with a sync mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list.mapAsync(x => x + 1);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should be chainable', () => co(function*() {
      let list = List.of(1, 2, 3);
      let mapperAsync = (elem) => co(function*() {
        yield sleep(1);
        return elem + 1;
      });
      let actual = yield list
        .mapAsync(mapperAsync)
        .mapAsync(mapperAsync);
      let expected = List.of(3, 4, 5);
      assert.deepEqual(actual, expected);
    }));

    it('should map in parallel', () => co(function*() {
      let list = List.of(1, 2, 3);
      let running = 0;
      let mapperAsync = (elem) => co(function*() {
        running += 1;
        yield sleep();
        running -= 1;
        return elem + 1;
      });
      let mapping = list.mapAsync(mapperAsync);
      assert.strictEqual(running, list.length);
      yield mapping;
      assert.strictEqual(running, 0);
    }));
  });

  describe('#mapLimit()', () => {

    let mapperAsync = (elem) => co(function*() {
      yield sleep(1);
      return elem + 1;
    });

    it('should return a ListPromise<List>', () => co(function*() {
      let list = List.of(1, 2, 3);
      let promise = list.mapLimit(x => x, 1);
      assert.instanceOf(promise, ListPromise);
      let mapped = yield promise;
      assert.notStrictEqual(list, mapped);
      assert.deepEqual(list, mapped);
      assert.instanceOf(mapped, List);
    }));

    it('should accept an async mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list.mapSeries(mapperAsync, 2);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should work with a sync mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list.mapLimit(x => x + 1, 1);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should use 1 as a default limit', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list.mapLimit(mapperAsync);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should run limit of mappers in parallel', () => co(function*() {
      let list = List.of(1, 2, 3, 4, 5, 6, 7);
      let running = 0;
      let limit = 3;
      let mapper = (elem, index) => co(function*() {
        running += 1;
        assert.isAtMost(running, limit);
        let timeout = 100 - index * 10;
        yield sleep(timeout);
        running -= 1;
        assert.isAtLeast(running, 0);
        return elem + 1;
      });

      let resolving = list.mapLimit(mapper, limit);
      assert.strictEqual(running, 3);
      let actual = yield resolving;
      let expected = List.of(2, 3, 4, 5, 6, 7, 8);
      assert.deepEqual(actual, expected);
    }));

    it('should propagate errors from mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let errorMessage = 'TEST_ERROR';
      let mapper = (elem, index) => co(function*() {
        if (index === 1) {
          throw new Error(errorMessage);
        }
        return elem + 1;
      });
      let error = null;
      try {
        yield list.mapLimit(mapper);
      }
      catch (e) {
        error = e;
      }
      assert.isOk(error);
      assert.instanceOf(error, Error);
      assert.strictEqual(error.message, errorMessage);
    }));
  });

  describe('#mapSeries()', () => {

    let mapperAsync = (elem) => co(function*() {
      yield sleep(1);
      return elem + 1;
    });

    it('should return a ListPromise<List>', () => co(function*() {
      let list = List.of(1, 2, 3);
      let promise = list.mapSeries(x => x);
      assert.instanceOf(promise, ListPromise);
      let mapped = yield promise;
      assert.notStrictEqual(list, mapped);
      assert.deepEqual(list, mapped);
      assert.instanceOf(mapped, List);
    }));

    it('should accept an async mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list.mapSeries(mapperAsync);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should work with a sync mapper', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list.mapSeries(x => x + 1);
      let expected = List.of(2, 3, 4);
      assert.deepEqual(actual, expected);
    }));

    it('should be chainable', () => co(function*() {
      let list = List.of(1, 2, 3);
      let actual = yield list
        .mapSeries(mapperAsync)
        .mapSeries(mapperAsync);
      let expected = List.of(3, 4, 5);
      assert.deepEqual(actual, expected);
    }));

    it('should map in series', () => co(function*() {
      let list = List.of(1, 2, 3);
      let running = 0;
      let mapper = (elem) => co(function*() {
        running += 1;
        assert.strictEqual(running, 1);
        yield sleep();
        running -= 1;
        assert.strictEqual(running, 0);
        return elem + 1;
      });
      let mapping = list.mapSeries(mapper);
      assert.strictEqual(running, 1);
      yield mapping;
      assert.strictEqual(running, 0);
    }));
  });

  describe('#none()', () => {
    it('should return true when none of the elements pass a given predicate', () => {
      const list = List.of(1, 2, 3, 4);
      const none = list.none(x => typeof x === 'string');
      assert.isTrue(none);
    });

    it('should return false when any of the elements passes a given predicate', () => {
      const list = List.of('1', '2', 3, '4');
      const none = list.none(x => Number.isFinite(x));
      assert.isFalse(none);
    });

    it('should use the identity function as a default predicate', () => {
      const list = List.of(null, undefined, 0, '', false);
      const none = list.none();
      assert.isTrue(none);
    });

    it('should return true from an empty list', () => {
      const list = List.of();
      const none = list.none(() => true);
      assert.isTrue(none);
    });
  });

  describe('#orderBy()', () => {

    let unsorted = new List(
      { id: 1, name: 'bob', data: 123 },
      { id: 2, name: 'bob', data: 422 },
      { id: 3, name: 'jim', data: 421 },
      { id: 4, name: 'bob', data: 321 },
      { id: 5, name: 'jim', data: 421 },
      { id: 6, name: 'jim', data: 123 },
      { id: 7, name: 'bob', data: 421 },
      { id: 8, name: 'jim', data: 123 }
    );

    it('should not modify the original list', () => {
      let sorted = unsorted.orderBy(x => x.data * -1);
      assert.isTrue(unsorted !== sorted);
      assert.isTrue(unsorted[0].id !== sorted[0].id);
    });

    it('should accept string arguments', () => {
      let actual = unsorted.orderBy('name', 'data');
      let expected = new List(
        { id: 1, name: 'bob', data: 123 },
        { id: 4, name: 'bob', data: 321 },
        { id: 7, name: 'bob', data: 421 },
        { id: 2, name: 'bob', data: 422 },
        { id: 6, name: 'jim', data: 123 },
        { id: 8, name: 'jim', data: 123 },
        { id: 3, name: 'jim', data: 421 },
        { id: 5, name: 'jim', data: 421 }
      );
      assert.deepEqual(actual, expected);
    });

    it('should sort descending with -string argument', () => {
      let actual = unsorted.orderBy('-name', 'data');
      let expected = new List(
        { id: 6, name: 'jim', data: 123 },
        { id: 8, name: 'jim', data: 123 },
        { id: 3, name: 'jim', data: 421 },
        { id: 5, name: 'jim', data: 421 },
        { id: 1, name: 'bob', data: 123 },
        { id: 4, name: 'bob', data: 321 },
        { id: 7, name: 'bob', data: 421 },
        { id: 2, name: 'bob', data: 422 }
      );
      assert.deepEqual(actual, expected);
    });

    it('should accept function selector arguments', () => {
      let actual = unsorted.orderBy(x => x.name, x => x.data * -1);
      let expected = new List(
        { id: 2, name: 'bob', data: 422 },
        { id: 7, name: 'bob', data: 421 },
        { id: 4, name: 'bob', data: 321 },
        { id: 1, name: 'bob', data: 123 },
        { id: 3, name: 'jim', data: 421 },
        { id: 5, name: 'jim', data: 421 },
        { id: 6, name: 'jim', data: 123 },
        { id: 8, name: 'jim', data: 123 }
      );
      assert.deepEqual(actual, expected);
    });

    it('should accept array arguments as [ selector, direction ]', () => {
      let actual = unsorted.orderBy(
        [ 'name', -1 ],
        [ x => x.data, -1 ]
      );
      let expected = new List(
        { id: 3, name: 'jim', data: 421 },
        { id: 5, name: 'jim', data: 421 },
        { id: 6, name: 'jim', data: 123 },
        { id: 8, name: 'jim', data: 123 },
        { id: 2, name: 'bob', data: 422 },
        { id: 7, name: 'bob', data: 421 },
        { id: 4, name: 'bob', data: 321 },
        { id: 1, name: 'bob', data: 123 }
      );
      assert.deepEqual(actual, expected);
    });

    it('should accept mixtures of argument types', () => {
      let actual = unsorted.orderBy(
        '-name',
        x => x.data,
        [ 'id', -1 ]
      );
      let expected = new List(
        { id: 8, name: 'jim', data: 123 },
        { id: 6, name: 'jim', data: 123 },
        { id: 5, name: 'jim', data: 421 },
        { id: 3, name: 'jim', data: 421 },
        { id: 1, name: 'bob', data: 123 },
        { id: 4, name: 'bob', data: 321 },
        { id: 7, name: 'bob', data: 421 },
        { id: 2, name: 'bob', data: 422 }
      );
      assert.deepEqual(actual, expected);
    });

    it('should not sort when no arguments are provided', () => {
      let actual = unsorted.orderBy();
      let expected = new List(
        { id: 1, name: 'bob', data: 123 },
        { id: 2, name: 'bob', data: 422 },
        { id: 3, name: 'jim', data: 421 },
        { id: 4, name: 'bob', data: 321 },
        { id: 5, name: 'jim', data: 421 },
        { id: 6, name: 'jim', data: 123 },
        { id: 7, name: 'bob', data: 421 },
        { id: 8, name: 'jim', data: 123 }
      );
      assert.deepEqual(actual, expected);
    });
  });

  describe('#reduce()', () => {
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

  describe('#resolve()', () => {
    it('should return ListPromise<List>', () => co(function*() {
      let list = List.of(1, 2, 3);
      let resolving = list.resolve();
      assert.instanceOf(resolving, ListPromise);
      let resolved = yield resolving;
      assert.instanceOf(resolved, List);
      assert.deepEqual(resolved, List.of(1, 2, 3));
    }));

    it('should resolve a List of promises', () => co(function*() {
      let list = List.of(
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3)
      );
      let actual = yield list.resolve();
      let expected = List.of(1, 2, 3);
      assert.deepEqual(actual, expected);
    }));

    it('should resolve a List of mixed values', () => co(function*() {
      let list = List.of(
        1,
        Promise.resolve(2),
        3
      );
      let actual = yield list.resolve();
      let expected = List.of(1, 2, 3);
      assert.deepEqual(actual, expected);
    }));
  });

  describe('#reversed()', () => {
    it('should return a new List', () => {
      let list = new List();
      let reversed = list.reversed();
      assert.notStrictEqual(list, reversed);
      assert.instanceOf(reversed, List);
    });

    it('should return a reversed copy', () => {
      let list = List.of(1, 2, 3, 4);
      let actual = list.reversed();
      let expected = List.of(4, 3, 2, 1);
      assert.deepEqual(actual, expected);
    });

    it('should not modify the original', () => {
      let actual = List.of(1, 2, 3, 4);
      actual.reversed();
      let expected = List.of(1, 2, 3, 4);
      assert.deepEqual(actual, expected);
    });

    it('should work with empty lists', () => {
      let list = new List();
      let actual = list.reversed();
      let expected = new List();
      assert.deepEqual(actual, expected);
    });

    it('should work with single item lists', () => {
      let list = List.of(1);
      let actual = list.reversed();
      let expected = List.of(1);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#some()', () => {
    it('should be an alias for List#any()', () => {
      assert.strictEqual(List.prototype.some, List.prototype.any);
    });
  });

  describe('#sum()', () => {
    it('should return the sum of all numbers in the List', () => {
      let list = List.of(1, 2, 3, 4);
      let actual = list.sum();
      let expected = 10;
      assert.strictEqual(actual, expected);
    });

    it('should consider all non-numbers to be 0', () => {
      let list = List.of(1, 2, undefined, 3, '4', null, NaN);
      let actual = list.sum();
      let expected = 6;
      assert.strictEqual(actual, expected);
    });

    it('should return 0 from an empty List', () => {
      let list = List.of();
      let actual = list.sum();
      let expected = 0;
      assert.strictEqual(actual, expected);
    });

    it('should use a given selector', () => {
      let list = List.of(
        { id: 1, count: 3 },
        { id: 2, count: 2 },
        { id: 3, count: 4 },
        { id: 4, count: 1 }
      );
      let actual = list.sum(elem => elem.count);
      let expected = 10;
      assert.strictEqual(actual, expected);
    });
  });

  describe('#tail()', () => {
    it('should return a new List', () => {
      let list = new List();
      let tail = list.tail();
      assert.notStrictEqual(list, tail);
      assert.instanceOf(tail, List);
    });

    it('should return all but the first element', () => {
      let list = List.of(1, 2, 3);
      let actual = list.tail();
      let expected = List.of(2, 3);
      assert.deepEqual(actual, expected);
    });

    it('should return an empty list from empty list', () => {
      let list = new List();
      let actual = list.tail();
      let expected = new List();
      assert.deepEqual(actual, expected);
    });

    it('should return empty list from single item list', () => {
      let list = List.of(1);
      let actual = list.tail();
      let expected = new List();
      assert.deepEqual(actual, expected);
    });
  });

  describe('#take()', () => {
    it('should return a new List', () => {
      let list = new List();
      let taken = list.take();
      assert.notStrictEqual(list, taken);
      assert.instanceOf(taken, List);
    });

    it('should take a given count of elements', () => {
      let list = List.of(1, 2, 3);
      let actual = list.take(2);
      let expected = List.of(1, 2);
      assert.deepEqual(actual, expected);
    });

    it('should take one element by default', () => {
      let list = List.of(1, 2, 3);
      let actual = list.take();
      let expected = List.of(1);
      assert.deepEqual(actual, expected);
    });

    it('should return full list when count >= length', () => {
      let list = List.of(1, 2, 3);
      let actual = list.take(4);
      let expected = List.of(1, 2, 3);
      assert.strictEqual(expected.length, 3);
      assert.deepEqual(actual, expected);
    });

    it('should return empty list when count < 1', () => {
      let list = List.of(1, 2, 3);
      let actual = list.take(-1);
      let expected = new List();
      assert.strictEqual(expected.length, 0);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#takeWhile()', () => {
    it('should take elements from a list while a given predicate passes', () => {
      let list = List.of(1, 2, 3, 2, 1);
      let actual = list.takeWhile(x => x < 3);
      let expected = List.of(1, 2);
      assert.deepEqual(actual, expected);
    });

    it('should return an empty List from an empty List', () => {
      let list = List.of();
      let actual = list.takeWhile(() => true);
      let expected = List.of();
      assert.notStrictEqual(actual, expected);
      assert.deepEqual(actual, expected);
    });

    it('should use the identity function as a default predicate', () => {
      let list = List.of(1, 2, null, 3, 4);
      let actual = list.takeWhile();
      let expected = List.of(1, 2);
      assert.deepEqual(actual, expected);
    });
  });

  describe('#unique()', () => {
    it('should return a new List', () => {
      let list = new List();
      let unique = list.unique();
      assert.notStrictEqual(list, unique);
      assert.instanceOf(unique, List);
    });

    it('should return a List containing only unique elements', () => {
      let list = List.of(1, 1, '1', 2, 3);
      let actual = list.unique();
      let expected = List.of(1, '1', 2, 3);
      assert.deepEqual(actual, expected);
    });

    it('should accept a hasher for equality comparisons', () => {
      let list = List.of(1, 1, '1', '2', '3.000', 3);
      let actual = list.unique(Number);
      let expected = List.of(1, '2', '3.000');
      assert.deepEqual(actual, expected);
    });

    it('should not modify the original List', () => {
      let actual = List.of(1, 1, 2, 3);
      actual.unique();
      let expected = List.of(1, 1, 2, 3);
      assert.deepEqual(actual, expected);
    });
  });

});
