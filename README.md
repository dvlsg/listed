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
  * [#map()](#map)
  * [#mapAsync()](#mapasync)
  * [#mapLimit()](#maplimit)
  * [#mapSeries()](#mapseries)
  * [#orderBy()](#orderby)
  * [#reduce()](#reduce)
  * [#resolve()](#resolve)

### List

#### .from()

```js
from(arr: arrayLike): List
```

Converts an existing `Array`, array-like, or iterable `Object` to a new `List`.

```js
const list = List.from([ 1, 2, 3 ]);
//=> List [ 1, 2, 3 ]
```

#### .of()

```js
from(...any): List
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
List#every :: List a ~> (a -> Boolean) -> Boolean
List#every :: List a ~> () -> Boolean
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

```js
filter(predicate: Function): List
filter(): List
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

#### #map()

```js
map(transformer: Function): List
map(): List
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

A helper method for resolving a List of promises or values down into a List of values wrapped in a single promise.

```js
const list = List.of(1, Promise.resolve(2), 3);
const resolved = await list.resolve();
//=> List [ 1, 2, 3 ]
```

Calling this method is the equivalent of calling `Promise.all(list).then(List.from)`.

#### #take()

```
List#take :: List<T> ~> (Number) -> List<T>
```

Returns a list containing a given number of elements.

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
