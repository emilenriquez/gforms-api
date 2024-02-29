/* eslint-disable max-lines */
'use strict';

const Schmervice = require('@hapipal/schmervice');
const crypto = require('crypto');
const fp = require('lodash/fp');
const Boom = require('@hapi/boom')
const authUtils = require('../auth/utils')
const { convertObjectKeys, camelToSnake } = require('../utils');

module.exports = class UserService extends Schmervice.Service {
  async findById(id) {
    const {
      User: UserModel,
    } = this.server.models();

    const user = await UserModel.query().findById(id);

    if(!user) {
      return Boom.notFound();
    }

    return user;
  }

  async createUser(userData) {
    try {
      const {
        User: UserModel,
      } = this.server.models();

      //hash the pw
      const hashedPW = hashString(userData.password);

      const user = await UserModel.query().insert({
        ...convertObjectKeys(userData, camelToSnake),
        password: hashedPW
      });

      return user;
    }
    catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const { User } = this.server.models();

      // TODO: auto camelCase of db result keys
      const user = await User.query().findOne('email', email);

      if (fp.isEmpty(user)) {
        throw Boom.notFound(`User with e-mail "${email}" not found`);
      }

      // const isCorrectPw = await Bcrypt.compare(password, user.password);
      const isCorrectPw = hashString(password) === user.password;

      console.log('HASH', hashString(password))
      console.log('USER', user.password)

      if (!isCorrectPw) {
        throw Boom.badRequest(`Invalid password for ${user.email}`);
      }

      const loggedInUser = user;

      return {
        ...loggedInUser,
        access_token: authUtils.generateToken(fp.flow(
          fp.omit(['password'])
        )(loggedInUser))
      };
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
