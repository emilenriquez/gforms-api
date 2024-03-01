'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const OptionModel = require('../../models/option');


module.exports = {
  method: 'POST',
  path: '/userResponses',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
      Joi.object().keys({
        'authorization': Joi.string().required().description('Access Token')
      }).unknown(true),
      payload: Joi.object({
        form_id: Joi.number().integer().required(),
        responses: Joi.array().items(Joi.object({
          question_id: Joi.number().integer().required(),
          response: Joi.string().trim().required(),
        })).min(1).required(),
      }).label('UserResponse'),
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { userResponseService } = request.services();

        const { payload } = request;
        const user = request?.auth?.artifacts?.decoded; //TODO: simplify getting credentials

        const userFormResponse = await userResponseService.create(payload, user);

        return userFormResponse;
      }
      catch (error) {
        return error;
      }
    }
  }
};
