"use strict";

const toString = Object.prototype.toString;
const type = (val) => toString.call(val);

const types = Object.create(null);

types.array = type([]);
types.function = type(() => {});
types.string = type('');
types.boolean = type(true);
types.number = type(0);
types.null = type(null);
types.undefined = type(undefined);
types.object = type({});
types.set = type(new Set());
types.map = type(new Map());
types.weakmap = type(new WeakMap());
types.weakset = type(new WeakSet());
types.date = type(new Date());
types.regexp = type(new RegExp());

types.regex = types.regexp;
types.bool = types.boolean;
types.obj = types.object;
types.arr = types.array;

module.exports = { type, types };
