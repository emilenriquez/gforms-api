'use strict';

const Schwifty = require('@hapipal/schwifty');
const Joi = require('joi');

module.exports = class Option extends Schwifty.Model {

  static tableName = 'options';

  static joiSchema = Joi.object({
    id: Joi.number().integer(),
    value: Joi.string().trim().required(),
    question_id: Joi.number().integer().required(),

    created_at: Joi.date().timestamp(),
    updated_at: Joi.date().timestamp(),
  }).label('Option');

  static get relationMappings() {
    const Question = require('./question');
    return {
      question: {
        relation: Schwifty.Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: `${this.tableName}.question_id`,
          to: `${Question.tableName}.id`
        }
      }
    };
  }
};
