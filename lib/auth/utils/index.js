'use strict';

const JWT = require('jsonwebtoken');

const generateToken = (userData = {}, expiresIn = '8h') => {
  const secret = process.env.SECRET;
  if (JSON.stringify(userData) === "{}") {
    throw new Error('user is required to generate JWT.');
  }

  return JWT.sign(userData, secret, { expiresIn });
};

module.exports = {
  generateToken
};
