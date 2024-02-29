'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const OptionModel = require('../../models/option');


module.exports = {
  method: 'POST',
  path: '/options',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
      Joi.object().keys({
        'authorization': Joi.string().required().description('Access Token')
      }).unknown(true),
      payload: OptionModel
        .joiSchema,
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { optionService } = request.services();

        const { payload } = request;
        const credentials = request?.auth?.artifacts?.decoded; //TODO: simplify getting credentials

        const option = await optionService.create(payload, credentials.id);

        return option;
      }
      catch (error) {
        return error;
      }
    }
  }
};
