/* eslint-disable max-lines */
'use strict';

const Boom = require('@hapi/boom');
const Schmervice = require('@hapipal/schmervice');


module.exports = class FormService extends Schmervice.Service {
  async getById(id) {
    const {
      Form: FormModel,
    } = this.server.models();

    // TODO: maybe also return the associated options if its not a freetext?
    const question = await FormModel.query()
        .findById(id)
        .withGraphFetched('questions.options');

    if(!question) {
      throw Boom.notFound('record not found')
    }

    return question;
  }

  async getAll() {
    try {
      const {
        Form: FormModel,
      } = this.server.models();

      const forms = await FormModel.query();

      return forms;
    }
    catch (error) {
      throw error;
    }
  }

  async create({label, adminId}) {
    try {
      const {
        Form: FormModel,
        User: UserModel
      } = this.server.models();

      const formOwner = await UserModel.query().findById(adminId);


      // check if formOwner is admin, if not, cannot create form
      if (formOwner.role !== 'ADMIN') { // TODO: put roles in constant
        throw Boom.forbidden('You do not have permission to create forms');
      }

      const form = await FormModel.query().insert({
        label,
        admin_id: adminId,
        created_at: Date.now(),
        updated_at: Date.now()
      });

      return form;
    }
    catch (error) {
      throw error;
    }
  }
  /**
 * Updates a form based on the provided payload.id and requestor credentials.
 *
 * @async
 * @function update
 * @param {Object} payload - The payload containing the updated form details.
 * @param {number} payload.id - The ID of the form to be updated.
 * @param {string} [payload.label] - The updated label for the form.
 * @param {any} [payload.otherDetails] - Other form details to be updated.
 * @param {number} adminId - The ID of the admin performing the update.
 * @returns {Promise<Object>} A Promise that resolves to the updated form.
 * @throws {Error} Throws an error if the form update fails.
 *
 * @example
 * const payload = {
 *   id: 1,
 *   label: 'Updated Form Label',
 *   // Other form details to be updated
 * };
 * const adminId = 123;
 * try {
 *   const updatedForm = await update(payload, adminId);
 *   console.log(updatedForm);
 * } catch (error) {
 *   console.error(error.message);
 * }
 */
  async update(payload, adminId) {
    try {
      const {
        Form: FormModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const form = await FormModel.query()
        .findById(payload.id)
        .withGraphFetched('adminUser');

      // check if requestor is admin and the admin owns the form
      if (admin.role !== 'ADMIN' || form.adminUser.id !== adminId) { // TODO: put roles in constant
        throw Boom.forbidden('You do not have permission to update this form');
      }

      const updatedForm = await FormModel.query()
        .patchAndFetchById(payload.id, {
          label: payload.label,
          updated_at: Date.now()
        });

      return updatedForm;
    }
    catch (error) {
      throw error;
    }
  }

  async delete(formId, adminId) {
    const {
      Form: FormModel,
      Question: QuestionModel,
      Option: OptionModel,
      User: UserModel
    } = this.server.models();

    const admin = await UserModel.query().findById(adminId);
    const form = await FormModel.query()
      .findById(formId)
      .withGraphFetched('adminUser');

    // check if requestor is admin and the admin owns the form
    if (admin.role !== 'ADMIN' || form.adminUser.id !== adminId) { // TODO: put roles in constant
      throw Boom.forbidden('You do not have permission to DELETE this form');
    }

    // delete related questions and options associated to this form
    // Use transaction to ensure atomicity
    return FormModel.transaction(async (trx) => {

      const questionIds = await QuestionModel.query().where('form_id', formId).pluck('id');
      await OptionModel.query().delete().whereIn('question_id', questionIds).transacting(trx);
      await QuestionModel.query().delete().where('form_id', formId).transacting(trx);

      // Delete the form
      const deletedForm = await FormModel.query().deleteById(formId).returning('*').transacting(trx);

      return deletedForm;
    });

  }
};
