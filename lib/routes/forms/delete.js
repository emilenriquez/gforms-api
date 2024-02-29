'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const QuestionModel = require('../../models/question');


module.exports = {
  method: 'DELETE',
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
      }).label('Form'),
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { formService } = request.services();

        const { params, auth } = request;
        const credentials = auth?.artifacts?.decoded;

        const form = await formService.delete(
          params.id,
          credentials.id
        );

        return form;
      }
      catch (error) {
        return error;
      }
    }
  }
};
