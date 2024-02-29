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
      if (admin.role !== 'ADMIN' || form.adminUser.id !== admin.id) { // TODO: put roles in constant
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

  async update(payload, adminId) {
    try {
      const {
        Option: OptionModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const option = await OptionModel.query()
        .findById(payload.id)
        .withGraphFetched('question.form');

      if(!option) {
        throw Boom.notFound('option not found!')
      }

      // check if user is an admin and he owns the form
      if (admin.role !== 'ADMIN' || option?.question?.form.admin_id !== admin.id) { // TODO: put roles in constant ?
        throw Boom.forbidden('You do not have permission to edit the form!');
      }

      // if type of Question is FREETEXT do now allow creation of options
      // note: that this only assumes we have a freetext and a multiple choice type of questions
      if(option.question.type === 'FREETEXT') {
        throw Boom.badRequest('cannot update an option for question type FREETEXT');
      }

      const updatedOption = await OptionModel.query()
        .patchAndFetchById(payload.id, {
          ...convertObjectKeys(payload, camelToSnake),
          updated_at: Date.now()
        });

      return updatedOption;

    }
    catch (error) {
      throw error;
    }
  }

  async delete(optionId, adminId) {
    try {
      const {
        Option: OptionModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const option = await OptionModel.query()
        .findById(optionId)
        .withGraphFetched('question.form');

      if (admin.role !== 'ADMIN' || option?.question?.form.admin_id !== admin.id) { // TODO: put roles in constant ?
        throw Boom.forbidden('You do not have permission to update the form!');
      }

      const deletedOption = await OptionModel.query().deleteById(optionId).returning('*');

      if (!deletedOption) {
        throw new Error(`Option with ID ${optionId} not found`);
      }

      return deletedOption;
    } catch (error) {
      // Handle the error, e.g., log it or throw a more specific exception
      throw error;
    }
  }

};
