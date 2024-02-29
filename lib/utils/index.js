'use strict';

const toCamelCase = str => str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());

const convertObjectKeys = (obj, fn) => Object
  .entries(obj)
  .reduce((newObj, [key, value]) => ({
    ...newObj,
    [fn(key)]: value
  }), {});

module.exports = {
  toCamelCase,
  convertObjectKeys
};
