'use strict';

const Schwifty = require('@hapipal/schwifty');
const Joi = require('joi');

module.exports = class UserResponse extends Schwifty.Model {

  static tableName = 'user_responses';

  static joiSchema = Joi.object({
    id: Joi.number().integer(),
    user_id: Joi.number().integer().required(),
    form_id: Joi.number().integer().required(),
    question_id: Joi.number().integer().required(),
    response: Joi.string().trim().required(),

    created_at: Joi.date(),
    updated_at: Joi.date()
  }).label('Question');

  static get relationMappings() {
    const Form = require('./form');
    const Question = require('./question');
    const User = require('./question');

    return {
      form: {
        relation: Schwifty.Model.BelongsToOneRelation,
        modelClass: Form,
        join: {
          from: `${this.tableName}.form_id`,
          to: `${Form.tableName}.id`
        }
      },
      user: {
        relation: Schwifty.Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${this.tableName}.form_id`,
          to: `${User.tableName}.id`
        }
      },
      question: {
        relation: Schwifty.Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: `${this.tableName}.form_id`,
          to: `${Question.tableName}.id`
        }
      },

    };
  }
};
