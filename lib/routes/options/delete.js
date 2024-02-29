'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');


module.exports = {
  method: 'DELETE',
  path: '/options/{id}',
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
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { optionService } = request.services();

        const { params, auth } = request;
        const credentials = auth?.artifacts?.decoded;

        const deletedQuestion = await optionService.delete(
          params.id,
          credentials.id
        );

        return deletedQuestion;
      }
      catch (error) {
        return error;
      }
    }
  }
};
