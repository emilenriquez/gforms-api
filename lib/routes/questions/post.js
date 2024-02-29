'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const QuestionModel = require('../../models/question');


module.exports = {
  method: 'POST',
  path: '/questions',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
      Joi.object().keys({
        'authorization': Joi.string().required().description('Access Token')
      }).unknown(true),
      payload: QuestionModel
        .joiSchema,
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { questionService } = request.services();

        const { payload } = request;
        const credentials = request?.auth?.artifacts?.decoded; //TODO: simplify getting credentials

        const question = await questionService.create(payload, credentials.id);

        return question;
      }
      catch (error) {
        return error;
      }
    }
  }
};
