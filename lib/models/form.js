'use strict';

const Schwifty = require('@hapipal/schwifty');
const Joi = require('joi');

module.exports = class Form extends Schwifty.Model {

  static tableName = 'forms';

  static joiSchema = Joi.object({
    id: Joi.number().integer(),
    label: Joi.string().trim().required(),
    admin_id: Joi.number().integer().required().min(1),
    created_at: Joi.date(),
    updated_at: Joi.date()
  }).label('Form');

  static get relationMappings() {
    const User = require('./user');
    return {
      adminUser: {
        relation: Schwifty.Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'forms.admin_id',
          to: 'users.id'
        }
      }
    };
  }
};
