'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = {
  method: 'post',
  path: '/login',
  options: {
    tags: ['api'],
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      }).label('UserLogin'),
      failAction: (request, h, err) => {
        // Custom error response
        throw Boom.badRequest(err.message);
      }
    },
    handler: async request => {
      try {
        const { userService } = request.services();
        const { payload } = request;

        const { email, password } = payload;

        const user = await userService.login(email, password);

        return user;
      }
      catch (error) {
        return Boom.boomify(error);
      }
    }
  }
};
