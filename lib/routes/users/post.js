'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const UserModel = require('../../models/user');

// schema update
const updatedUserSchema = UserModel.joiSchema.unknown(true).keys({
  id: Joi.forbidden(), // Exclude id
  created_at: Joi.forbidden(), // Exclude createdAt
  updated_at: Joi.forbidden(), // Exclude updatedAt
});


module.exports = {
  method: 'POST',
  path: '/users',
  options: {
    tags: ['api'],
    validate: {
      payload: updatedUserSchema,
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
