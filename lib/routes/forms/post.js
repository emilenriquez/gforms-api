'use strict';

const Boom = require('@hapi/boom');
const Joi = require('joi');
const FormModel = require('../../models/form');


module.exports = {
  method: 'POST',
  path: '/forms',
  options: {
    tags: ['api'],
    auth: 'jwt',
    validate: {
      headers:
      Joi.object().keys({
        'authorization': Joi.string().required().description('Access Token')
      }).unknown(true),
      payload: Joi.object({
        label: Joi.string().required()
      }).label('Form'),
      failAction: (request, h, error) =>
        Boom.boomify(error)
    },
    handler: async request => {
      try {
        const { formService } = request.services();

        const { payload } = request;
        const credentials = request?.auth?.artifacts?.decoded;


        console.log('auth', request.auth);
        console.log('creds', credentials);

        const form = await formService.create({
          label:payload.label,
          adminId: credentials.id
        });

        return form;
      }
      catch (error) {
        return error;
      }
    }
  }
};
