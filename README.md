# listed

A functional, performant, list processing library designed to take advantage of Array subclassing.

```js
// main example to come
```

## Installation

```js
npm install listed
```

## Usage

A `List` is an extended array, which contains additional functional extensions to assist with processing data.

```js
const { List } = require('listed');
let list = List.of(1, 2, 3, 4, 5);
```

In order to use this library, Array subclass must be available to you. Please see the [ES compatibility table](http://kangax.github.io/compat-table/es6/) for more information.

## Default Task

* Install `node.js`
* Clone the `listed` project
* Run `npm install`
* Run `gulp`
  * Executes tests
  * Lints source code
  * Starts a watch task on source and tests

## Benchmarks

To run benchmarks of performance comparisons with other popular data manipulation libraries, run `gulp perf`, or run any of the `./perf/listed-*.perf.js` files through `node`.

## API

### Links

* List
  * [.from()](#from)
  * [.of()](#of)
  * [#every()](#every)
  * [#filter()](#filter)
  * [#first()](#first)
  * [#flatMap()](#flatmap)
  * [#flatten()](#flatten)
  * [#last()](#last)
  * [#map()](#map)
  * [#mapAsync()](#mapasync)
  * [#mapLimit()](#maplimit)
  * [#mapSeries()](#mapseries)
  * [#orderBy()](#orderby)
  * [#reduce()](#reduce)
  * [#resolve()](#resolve)
  * [#reversed()](#reversed)
  * [#sum()](#sum)
  * [#tail()](#tail)
  * [#take()](#take)
  * [#unique()](#unique)

### List

#### .from()

```
List.from :: (arrayLike<T> | Array<T> | Iterable<T>) -> List<T>
```

Converts an existing `Array`, array-like, or iterable `Object` to a new `List`.

```js
const list = List.from([ 1, 2, 3 ]);
//=> List [ 1, 2, 3 ]
```

#### .of()

```
List.of :: (...T) -> List<T>
```

Creates a new `List` containing all of the provided arguments.

```js
const list = List.of(1, 2, 3);
//=> List [ 1, 2, 3 ]
```

Note that this will work even with a single `Number` argument, whereas `new List(number)` will create a `List` with the length of that argument.

```js
const list = List.of(1);
//=> List [ 1 ]
```

#### #every()

```
List#every :: List<T> ~> (T -> Boolean) -> Boolean
```

Returns a `Boolean` indicating whether or not every value passes a given predicate. The index of the element, and a reference to the original `List` will also be provided to the predicate.

```js
const list = List.of(1, 2, 3);
const passed = list.every(x => typeof x === 'number');
//=> true
```

If no predicate is provided, then the identity function will be used as a default.

```js
const list = List.of(0, 1, 2, 3);
const passed = list.every();
//=> false
```

#### #filter()

```
List#filter :: List<T> ~> ((T, Number, List<T>) -> Boolean) -> List<T>
```

Returns a new `List` only containing elements which pass the given predicate.

```js
const list = List.of(1, 2, 3);
const filtered = list.filter(elem => elem > 1);
//=> List [ 2, 3 ]
```

The index of the element will be provided to the given predicate.

```js
const list = List.of(1, 2, 3);
const filtered = list.filter((elem, index) => index > 1);
//=> List [ 3 ]
```

A reference to the original `List` will also be provided to the given predicate.

```js
const list = List.of(1, 2, 3);
const filtered = list.filter((elem, index, listRef) => {
  console.log(list === listRef); //=> true
});
```

If no predicate is provided, then the identity function (`x => x`) will be used as a default.

```js
const list = List.of(0, 1, 2, null, 3);
const filtered = list.filter();
//=> List [ 1, 2, 3 ]
```

#### #first()

```
List#first :: List<T> ~> () -> T
```

Returns the first element from the `List`.

```js
const list = List.of(1, 2, 3);
const first = list.first();
//=> 1
```

If the `List` is empty, then `undefined` will be returned.

```js
const List = List.of();
const first = list.first();
//=> undefined
```

#### #flatMap()

```
List#flatMap :: List<T> ~> ((T, Number, List<T>) -> U | U[]) -> List<U>
```

Maps the `List` using a given mapper and flattens those results by one level.

```js
let list = List.of(1, 2, 3);
let mapped = list.flatMap(x => [ x, x ]);
//=> [ 1, 1, 2, 2, 3, 3 ]
```

#### #flatten()

```
List#flatten :: List<T | T[]> ~> () -> List<T>
List#flatten :: List<T | T[]> ~> (Number) -> List<T>
```

Flattens the `List` by one or a given number of levels.

```js
const list = List.of(1, 2, List.of(3, 4, List.of(5)));
const flattened = list.flatten();
//=> List [ 1, 2, 3, 4, List [ 5 ] ]
const flattened2 = list.flatten(2);
//=> List [ 1, 2, 3, 4, 5 ]
```

Flatten will also work with array-likes contained within the parent `List`.

```js
const list = List.of(1, 2, [ 3, 4 ]);
const flattened = list.flatten();
//=> List [ 1, 2, 3, 4 ]
```

#### #last()

```
List#last :: List<T> ~> () -> T
```

Returns the last element from the `List`.

```js
const list = List.of(1, 2, 3);
const last = list.last();
//=> 3
```

If the `List` is empty, then `undefined` will be returned.

```js
const List = List.of();
const last = list.last();
//=> undefined
```

#### #map()

```
List#map :: List<T> ~> ((T, Number, List<T>) -> U) -> List<U>
```

Returns a new `List` containing elements which have been mapped by the provided transformer.

```js
const list = List.of(1, 2, 3);
const mapped = List.map(elem => elem + 1);
//=> List [ 2, 3, 4 ]
```
The index of the element will also be provided to the given transformer.

```js
const list = List.of(1, 2, 3);
const mapped = List.map((elem, index) => elem + index);
//=> List [ 1, 3, 5 ]
```

A reference to the original `List` will also be provided to the given transformer.

```js
const list = List.of(1, 2, 3);
const mapped = List.map((elem, index, listRef) => {
  console.log(list === listRef); //=> true
});
```

If no transformer is provided, then the identity function (`x => x`) will be used as a default.

```js
const list = List.of(1, 2, 3);
const mapped = List.map();
//=> List [ 1, 2, 3 ]
```

#### #mapAsync()

```
List#mapAsync :: List<T> ~> (T -> Promise<T> | T) -> Promise<List<T>>
```

Asynchronously maps a `List` into a new `List` by using a provided asynchronous `mapper`. All mapping will be executed in *parallel*.

```js
const list = List.of('/users.json', '/tasks.json');
const mapped = await list.mapAsync(async elem => {
  const response = await fetch(elem);
  const json = await response.json();
  return json;
});
//=> List [ <users_json_data>, <tasks_json_data> ]
```

Note that even though `mapAsync()` returns a promise, you can still chain multiple `List` methods, including additional asynchronous calls.

```js
const list = List.of('/users.json', '/tasks.json');
const mapped = await list
  .mapAsync(fetch)
  .mapAsync(res => res.json());
//=> List [ <users_json_data>, <tasks_json_data> ]
```

#### #mapLimit()

```
List#mapLimit :: List<T> ~> (T -> Promise<T> | T, Number) -> Promise<List<T>>
```

Asynchronously maps a `List` into a new `List` by using a provided asynchronous `mapper`. Similar to `List#mapAsync()`, but only the provided `limit` of mappers can be run in parallel. If the given `limit` of mappers are already running, but we have not reached the end of the `List`, then any following mappers will be queued up to begin whenever a previous mapper completes.

For example, the following code will collect `users` and `tasks` data in parallel, but `products` collection will not begin until one of either `users` or `tasks` has completed.

```js
const list = List.of('/users.json', '/tasks.json', '/products.json');
const limit = 2;
const mapped = await list.mapLimit(async elem => {
  const response = await fetch(elem);
  const json = await response.json();
  return json;
}, limit);
//=> List [ <users_json_data>, <tasks_json_data>, <products_json_data> ]
```

#### #mapSeries()

```
List#mapSeries :: List<T> ~> (T -> Promise<T> | T) -> Promise<List<T>>
```

Asynchronously maps a `List` into a new List` by using a provided asynchronous `mapper`. This is similar to `List#mapAsync()`, but all asynchronous mapping will be executed in *series*, instead of in parallel.

```js
const list = List.of('/users.json', '/tasks.json');
const mapped = await list.mapSeries(async elem => {
  const response = await fetch(elem);
  const json = await response.json();
  return json;
});
//=> List [ <users_json_data>, <tasks_json_data> ]
```

#### #orderBy()

```
List#orderBy :: List<T> ~> (...Selector[]) -> List<T>
Selector :: String | Function | Array<String, Number> | Array<Function, Number>
```

Returns a new `List`, ordered by using a *stable* sort built from the provided selector definitions.

```js
let unordered = new List(
  { id: 1, name: 'bob', data: 123 },
  { id: 2, name: 'bob', data: 422 },
  { id: 3, name: 'jim', data: 421 },
  { id: 4, name: 'bob', data: 321 },
  { id: 5, name: 'jim', data: 421 },
  { id: 6, name: 'jim', data: 123 },
  { id: 7, name: 'bob', data: 421 },
  { id: 8, name: 'jim', data: 123 }
);
let ordered = unordered.orderBy('name', 'data');
/*=> List [
  { id: 1, name: 'bob', data: 123 },
  { id: 4, name: 'bob', data: 321 },
  { id: 7, name: 'bob', data: 421 },
  { id: 2, name: 'bob', data: 422 },
  { id: 6, name: 'jim', data: 123 },
  { id: 8, name: 'jim', data: 123 },
  { id: 3, name: 'jim', data: 421 },
  { id: 5, name: 'jim', data: 421 }
] */
```

Selectors can be provided as strings, functions, or arrays containing a string or function and direction.

If a selector is provided as a string, it will use the equivalent of `x => x[string]`.

If a selector is provided as a function, it will be used as is.

If provided as an array, it will use the first element as the selector, and the second element as the sort direction.

Note that in the case of providing a selector as a string, you may also prepend a `'-'` to the beginning of the string to indicate that you wish to use a descending sort for that selector.

For example, the following are all functionally equivalent, and `List#orderBy` will sort first by name ascending, then by data descending.

```js
list.orderBy('name', '-data');
list.orderBy(x => x.name, [ x => x.data, -1 ]);
list.orderBy('name', x => x.data * -1);
list.orderBy([ 'name', 1 ], [ 'data', -1 ]);
```

#### #reduce()

```
List#reduce :: List<T> ~> ((U, T, Number, List<T>) -> U, U) -> U
List#reduce :: List<T> ~> ((U, T, Number, List<T>) -> U) -> U
```

Reduces a `List` into a single value by iterating over and executing the provided `reducer` for each value, optionally starting with a given seed value.

```js
const list = List.of(2, 3, 4, 5);
const reduced = List.reduce((accumulator, elem) => {
  return accumulator + elem;
}, 1);
//=> 15 
```

If no seed value is provided, then the first element of the `List` will be used as the seed.

```js
const list = List.of(1, 2, 3, 4);
const reduced = List.reduce((accumulator, elem) => accumulator + elem);
//=> 10
```

The index of the element will be provided to the given reducer.

```js
const list = List.of(1, 2, 3, 4);
const reduced = List.reduce((accumulator, elem, index) => {
  return accumulator + index;
}, 0);
//=> 6
```

A reference to the original `List` will also be provided to the given reducer.

```js
const list = List.of(1, 2, 3, 4);
const reduced = List.reduce((accumulator, elem, index, listRef) => {
  console.log(list === listRef); //=> true
});
```

#### #resolve()

```
List#resolve :: List<Promise<T> | T> ~> () -> Promise<List<T>>
```

A helper method for resolving a `List` of promises or values down into a `List` of values wrapped in a single promise.

```js
const list = List.of(1, Promise.resolve(2), 3);
const resolved = await list.resolve();
//=> List [ 1, 2, 3 ]
```

Calling this method is the equivalent of calling `Promise.all(list).then(List.from)`.

#### #reversed()

```
List#reversed :: List<T> ~> () -> List<T>
```

Returns a `List` with elements in the reverse order. Note that this method does *not* modify the original `List`, unlike `Array#reverse()`.

```js
const list = List.of(1, 2, 3);
const reversed = list.reversed();
//=> List [ 3, 2, 1 ]
```

#### #sum()

```
List#sum :: List<Number> ~> () -> Number
List#sum :: List<T> ~> ((T) -> Number) -> Number
```

Returns the sum of all elements in the `List`.

```js
const list = List.of(1, 2, 3);
const sum = list.sum();
//=> 6
```

Accepts an optional selector to determine what elements to sum.

```js
const list = List.of(
  { id: 1, count: 3 },
  { id: 2, count: 2 },
  { id: 3, count: 4 },
  { id: 4, count: 1 }
);
const sum = list.sum(elem => elem.count);
//=> 10
```

#### #tail()

```
List::#tail :: List<T> ~> () -> List<T>
```

Returns a `List` containing every element but the first from the original.

```js
const list = List.of(1, 2, 3);
const tail = list.tail();
//=> List [ 2, 3 ]
```

#### #take()

```
List#take :: List<T> ~> (Number) -> List<T>
```

Returns a `List` containing a given number of elements.

```js
const list = List.of(1, 2, 3, 4, 5);
const taken = list.take(3);
//=> List [ 1, 2, 3 ]
```

If the given number of elements to take is larger than the number of available elements, then the entire list will be taken.

```js
const list = List.of(1, 2, 3);
const taken = list.take(4);
//=> List [ 1, 2, 3, 4 ]
```

#### #unique()

```
List#unique :: List<T> ~> () -> List<T>
List#unique :: List<T> ~> (T -> String | Number) -> List<T>
```

Returns a `List` containing only unique elements from the original list.

```js
const list = List.of(1, 2, 3, 3, 4, 4, 4, 5);
const unique = list.unique();
//=> List [ 1, 2, 3, 4, 5 ]
```

Unique accepts an optional hashing function used to determine the uniqueness of the elements.

```js
const list = List.of(
  { id: 1, value: 3 },
  { id: 2, value: 4 },
  { id: 3, value: 3 },
  { id: 4, value: 2 }
);
const unique = list.unique(x => x.value);
/*=> List [
  { id: 1, value: 3 },
  { id: 2, value: 4 },
  { id: 4, value: 2 }
] */
```

Note that the first unique element found will be the one placed in the resulting `List`.
