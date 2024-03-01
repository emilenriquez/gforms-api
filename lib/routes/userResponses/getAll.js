'use strict';

const Joi = require('joi');
const Boom = require('@hapi/boom');


/**
 * type can be alphanumeric, fn_key, mod_key
 */
module.exports = {
  method: 'get',
  path: '/userResponses',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
        Joi.object().keys({
          'authorization': Joi.string().required().description('Access Token')
        }).unknown(true),
      query: Joi.object().keys({
        form_id: Joi.number().integer().optional()
      }),
      failAction: (request, h, err) => {
        // Custom error response
        throw Boom.badRequest(err.message);
      }
    },
    handler: async request => {
      try {
        const { auth, query } = request;

        const { userResponseService } = request.services();
        const credentials = auth?.artifacts?.decoded;


        console.log('TEST', query);
        if(query.formId) {
          return userResponseService.getResponsesByForm(query.formId, credentials);
        }

        const userResponses = await userResponseService.getAll(credentials);

        return userResponses;
      }
      catch (error) {
        return Boom.boomify(error);
      }
    }
  }
};
