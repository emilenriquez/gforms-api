'use strict';

const toCamelCase = str => str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
const camelToSnake = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertObjectKeys = (obj, fn) => Object
  .entries(obj)
  .reduce((newObj, [key, value]) => ({
    ...newObj,
    [fn(key)]: value
  }), {});

module.exports = {
  toCamelCase,
  convertObjectKeys,
  camelToSnake
};
