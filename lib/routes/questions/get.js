'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');


/**
 * type can be alphanumeric, fn_key, mod_key
 */
module.exports = {
  method: 'get',
  path: '/questions/{id}',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
        Joi.object().keys({
          'authorization': Joi.string().required().description('Access Token')
        }).unknown(true),
      params: Joi.object({
        id: Joi.number().required()
      }),
      failAction: (request, h, err) => {
        // Custom error response
        throw Boom.badRequest(err.message);
      }
    },
    handler: async request => {
      try {
        // TODO: filter by search params
        const { params } = request;

        const { questionService } = request.services();
        const option = await questionService.getById(params.id);


        return option;
      }
      catch (error) {
        return Boom.boomify(error);
      }
    }
  }
};
