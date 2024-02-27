'use strict';

const Schwifty = require('@hapipal/schwifty');
const Joi = require('joi');

module.exports = class User extends Schwifty.Model {

  static tableName = 'users';

  static joiSchema = Joi.object({
    id: Joi.number().integer(),
    first_name: Joi.string().trim().required(),
    last_name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    role: Joi.string().valid('USER', 'ADMIN').optional(),
    created_at: Joi.date(),
    updated_at: Joi.date()
  }).label('User');
};
