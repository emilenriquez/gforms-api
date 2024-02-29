'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const QuestionModel = require('../../models/question');


// schema update
const updatedQuestionSchema = QuestionModel.joiSchema.unknown(true).keys({
  id: Joi.forbidden(), // Exclude id
  form_id: Joi.forbidden(), // Exclude form_id
  created_at: Joi.forbidden(), // Exclude createdAt
  updated_at: Joi.forbidden(), // Exclude updatedAt
});


module.exports = {
  method: 'PUT',
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
      payload: updatedQuestionSchema,
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { questionService } = request.services();

        const { payload, params, auth } = request;
        const credentials = auth?.artifacts?.decoded;

        const form = await questionService.update(
          {
            id: params.id,
            ...payload
          },
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
