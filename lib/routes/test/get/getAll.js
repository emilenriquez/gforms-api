'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');

module.exports = {
  method: 'get',
  path: '/tests',
  options: {
    tags: ['api'],
    validate: {
      query: Joi.object({
        test: Joi.string(),
      }).label('TEST'),
      failAction: (request, h, err) => {
        // Custom error response
        throw Boom.badRequest(err.message);
      }
    },
    handler: async request => {
      try {
        // TODO: filter by search params
        const { query: filters } = request;

        return {
          ...filters,
          test: 'ok'
        };
      }
      catch (error) {
        return Boom.boomify(error);
      }
    }
  }
};
