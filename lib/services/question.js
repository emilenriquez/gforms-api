/* eslint-disable max-lines */
'use strict';

const Boom = require('@hapi/boom');
const Schmervice = require('@hapipal/schmervice');
const { convertObjectKeys, camelToSnake } = require('../utils');


module.exports = class QuestionService extends Schmervice.Service {
  async getAll() {
    try {
      const {
        Question: QuestionModel,
      } = this.server.models();

      // todo: include the form details
      const options = await QuestionModel.query();

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
        Form: FormModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const form = await FormModel.query()
        .findById(payload.formId)
        .withGraphFetched('adminUser');

      // TODO: check if owner of form is same as the logged in user


      // check if formOwner is admin, if not, cannot create form
      if (admin.role !== 'ADMIN' && form.adminUser.id === form.id) { // TODO: put roles in constant
        throw Boom.forbidden('You do not have permission to create a question in this form');
      }

      if(!form) {
        throw Boom.notFound('form id not found!');
      }

      const question = await QuestionModel.query().insert(convertObjectKeys(payload, camelToSnake));

      return question;
    }
    catch (error) {
      throw error;
    }
  }

};
