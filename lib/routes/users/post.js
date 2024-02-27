'use strict';

const Boom = require('boom');
const Joi = require('joi');
const UserModel = require('../../models/user');


module.exports = {
  method: 'POST',
  path: '/users/create',
  options: {
    tags: ['api'],
    validate: {
      payload: UserModel
        .joiSchema,
      failAction: (request, h, error) =>
        Boom.boomify(error)

    },
    handler: async request => {
      try {
        const { userService } = request.services();

        const { payload } = request;

        const user = await userService.createUser(payload);
        return user;
      }
      catch (error) {
        return error;
      }
    }
  }
};
