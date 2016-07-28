"use strict";

const { List } = require('../');
const { assert } = require('chai');

describe('List', () => {

  describe('constructor', () => {
    it('should return instanceof List', () => {
      let list = new List();
      assert.instanceOf(list, List);
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

});
