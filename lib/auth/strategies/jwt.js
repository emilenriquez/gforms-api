'use strict';

const fp = require('lodash/fp');

module.exports = {
  name: 'jwt',
  scheme: 'jwt',
  options: {
    key: process.env.SECRET,
    urlKey: false,
    cookieKey: false,
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false
    },
    validate: async function (decoded, request){
      const { id } = decoded;
      const { userService } = request.services();

      if (!id) {
        return { isValid: false };
      }

      const validUser = await userService.findById(id);
      const credentials = fp.get('data', validUser);
      const isValid = !!validUser;

      return { isValid, credentials: credentials || {} };
    }
  }
};
