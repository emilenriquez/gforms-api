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
        Question: QuestionModel,
        Form: FormModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const form = await FormModel.query()
        .findById(payload.formId)
        .withGraphFetched('adminUser');

      // check if formOwner is admin, if not, cannot create form
      if (admin.role !== 'ADMIN' || form.adminUser.id !== admin.id) { // TODO: put roles in constant
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

  /**
   * Update a question based on the provided payload and admin ID.
   *
   * @async
   * @function update
   * @param {Object} payload - The payload containing the updated question details.
   * @param {number} payload.id - The ID of the question to be updated.
   * @param {string} [payload.label] - The updated label for the question.
   * @param {number} [payload.group_number] - The updated group number for the question.
   * @param {string} [payload.type] - The updated type for the question (e.g., "FREETEXT").
   * @param {boolean} [payload.is_required] - The updated flag indicating if the question is required.
   * @param {number} adminId - The ID of the admin performing the update.
   * @throws {Boom.notFound} Throws a "Not Found" error if the question with the specified ID is not found.
   * @throws {Boom.forbidden} Throws a "Forbidden" error if the requestor is not an admin or does not own the question's form.
   * @throws {Error} Throws an error if the question update fails.
   * @returns {Promise<Object>} A Promise that resolves to the updated question.
   *
   * @example
   * const payload = {
   *   id: 1,
   *   label: 'Updated Question Label',
   *   group_number: 1,
   *   type: 'FREETEXT',
   *   is_required: true
   * };
   * const adminId = 123;
   * try {
   *   const updatedQuestion = await update(payload, adminId);
   *   console.log(updatedQuestion);
   * } catch (error) {
   *   console.error(error.message);
   * }
   */
  async update(payload, adminId) {
    try {
      const {
        Question: QuestionModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const question = await QuestionModel.query()
        .findById(payload.id)
        .withGraphFetched('form');

      if(!question) {
        throw Boom.notFound('question not found!');
      }

      // check if requestor is admin and the admin owns the form
      if (admin.role !== 'ADMIN' || question.form.admin_id !== admin.id) { // TODO: put roles in constant
        throw Boom.forbidden('You do not have permission to update this form');
      }

      const updatedQuestion = await QuestionModel.query()
        .patchAndFetchById(payload.id, {
          ...convertObjectKeys(payload, camelToSnake),
          updated_at: Date.now()
        });

      return updatedQuestion;
    }
    catch (error) {
      throw error;
    }
  }

};
