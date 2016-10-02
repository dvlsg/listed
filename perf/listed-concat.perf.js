"use strict";

const data = require('./util/data');
const run = require('./util/run');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');

const sliced = [];
for (let i = 0; i < data.length; i += 100) {
  let begin = i;
  let end = i + 100;
  sliced.push(data.slice(begin, end));
}
const head = sliced[0];
const tail = sliced.slice(1);

const listHead = List.from(head);
const iterHead = iter(head);
const lazyHead = new Lazy(head);

const listConcat = () => listHead.concat(...tail);
const arrayConcat = () => head.concat(...tail);
const lodashConcat = () => lodash.concat(head, ...tail);
const iterableConcat = () => iterHead.concat(...tail).toArray();
const lazyConcat = () => lazyHead.concat(...tail).toArray();

run('concat', {
  'List#concat()': listConcat,
  'Array#concat()': arrayConcat,
  'Lodash.concat()': lodashConcat,
  'Iterable#concat()': iterableConcat,
  'Lazy#concat()': lazyConcat
});
