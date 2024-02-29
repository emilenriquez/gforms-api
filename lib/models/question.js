'use strict';

const Schwifty = require('@hapipal/schwifty');
const Joi = require('joi');

module.exports = class Question extends Schwifty.Model {

  static tableName = 'questions';

  static joiSchema = Joi.object({
    id: Joi.number().integer(),
    label: Joi.string().trim().required(),
    form_id: Joi.number().integer().required(),
    group_number: Joi.number().integer().required().min(1),
    type: Joi.string()
              .trim()
              .required()
              .valid('FREETEXT', 'SINGLE_CHOICE', 'MULTIPLE_SELECTION').default('FREETEXT'),
    is_required: Joi.bool().required().default(false),

    created_at: Joi.date(),
    updated_at: Joi.date()
  }).label('Question');

  static get relationMappings() {
    const Form = require('./form');
    const Option = require('./option');

    return {
      form: {
        relation: Schwifty.Model.BelongsToOneRelation,
        modelClass: Form,
        join: {
          from: `${this.tableName}.form_id`,
          to: `${Form.tableName}.id`
        }
      },
      options: {
        relation: Schwifty.Model.HasManyRelation,
        modelClass: Option,
        join: {
          from: `${this.tableName}.id`,
          to: `${Option.tableName}.question_id`
        }
      }
    };
  }
};
