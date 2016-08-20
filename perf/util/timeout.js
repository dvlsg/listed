"use strict";

module.exports = function timeout(delay = 0) {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
