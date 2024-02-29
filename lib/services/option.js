/* eslint-disable max-lines */
'use strict';

const Boom = require('@hapi/boom');
const Schmervice = require('@hapipal/schmervice');
const { convertObjectKeys, camelToSnake } = require('../utils');


module.exports = class OptionService extends Schmervice.Service {
  async getAll() {
    try {
      const {
        Option: OptionModel,
      } = this.server.models();

      // todo: include the form details
      const options = await OptionModel.query();

      return options;
    }
    catch (error) {
      throw error;
    }
  }

  async create(payload, adminId) {
    try {
      const {
        Option: OptionModel,
        Question: QuestionModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const question = await QuestionModel.query()
        .findById(payload.questionId)
        .withGraphFetched('[form.adminUser]');


      // check if formOwner is admin, if not, cannot create form
      if (admin.role !== 'ADMIN' && form.adminUser.id === form.id) { // TODO: put roles in constant
        throw Boom.forbidden('You do not have permission to edit the form!');
      }

      if(!question) {
        throw Boom.notFound('question id not found!');
      }

      // if type of Question is FREETEXT do now allow creation of options
      // note: that this only assumes we have a freetext and a multiple choice type of questions
      if(question.type === 'FREETEXT') {
        throw Boom.badRequest('cannot create an option for question type FREETEXT');
      }

      // check if the type of question is SINGLE_CHOICE or MULTIPLE_SELECTION

      const option = await OptionModel.query().insert(convertObjectKeys(payload, camelToSnake));

      return option;
    }
    catch (error) {
      throw error;
    }
  }

};
