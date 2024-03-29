'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');


/**
 * type can be alphanumeric, fn_key, mod_key
 */
module.exports = {
  method: 'get',
  path: '/forms/{id}',
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
        const { params } = request;

        const { formService } = request.services();

        // auth!!
        const form = await formService.getById(params.id);


        return form;
      }
      catch (error) {
        return Boom.boomify(error);
      }
    }
  }
};
