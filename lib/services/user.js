/* eslint-disable max-lines */
'use strict';

const Schmervice = require('@hapipal/schmervice');
const crypto = require('crypto');

module.exports = class UserService extends Schmervice.Service {
  async createUser(userData) {
    try {
      const {
        User: UserModel,
      } = this.server.models();

      //hash the pw
      const hashedPW = hashString(userData.password);

      const user = await UserModel.query().insert({
        ...userData,
        password: hashedPW
      });

      return user;
    }
    catch (error) {
      throw error;
    }
  }
};

function hashString(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}
