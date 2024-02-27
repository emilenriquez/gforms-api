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
        // TODO: filter by search params
        const { payload } = request;


        // TODO: implement and call the service

        return {
          user: 'TO IMPLEMENT'
        };
      }
      catch (error) {
        return Boom.boomify(error);
      }
    }
  }
};
