'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const OptionModel = require('../../models/option');

// schema update
const updatedOptionSchema = OptionModel.joiSchema.unknown(true).keys({
  id: Joi.forbidden(), // Exclude id
  question_id: Joi.forbidden(),
  created_at: Joi.forbidden(), // Exclude createdAt
  updated_at: Joi.forbidden(), // Exclude updatedAt
});

module.exports = {
  method: 'PUT',
  path: '/options/{id}',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
      Joi.object().keys({
        'authorization': Joi.string().required().description('Access Token')
      }).unknown(true),
      payload: updatedOptionSchema,
      params: Joi.object({
        id: Joi.number().required()
      }),
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { optionService } = request.services();

        const { payload, params, auth } = request;
        const credentials = auth?.artifacts?.decoded; //TODO: simplify getting credentials

        const option = await optionService.update({
          id: params.id,
          ...payload
        }, credentials.id);

        return option;
      }
      catch (error) {
        return error;
      }
    }
  }
};
