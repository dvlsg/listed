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
  * [.from()](.from)
  * [.of()](.of)
  * [#filter()](#filter)
  * [#map()](#map)

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

Note that this will work even with a single `Number` argument,whereas `new List(number)` will create a `List` with the length of that argument.

```js
const list = List.of(1);
//=> List [ 1 ]
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

The index of the element will also be provided to the given predicate.

```js
const list = List.of(1, 2, 3);
const filtered = list.filter((elem, index) => index > 1);
//=> List [ 3 ]
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

If no transformer is provided, then the identity function (`x => x`) will be used as a default.

```js
const list = List.of(1, 2, 3);
const mapped = List.map();
//=> List [ 1, 2, 3 ]
```

