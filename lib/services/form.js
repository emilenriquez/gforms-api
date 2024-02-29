/* eslint-disable max-lines */
'use strict';

const Boom = require('@hapi/boom');
const Schmervice = require('@hapipal/schmervice');


module.exports = class FormService extends Schmervice.Service {
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

  async update(payload, adminId) {
    try {
      const {
        Form: FormModel,
        User: UserModel
      } = this.server.models();

      const admin = await UserModel.query().findById(adminId);
      const form = await FormModel.query()
        .findById(payload.formId)
        .withGraphFetched('adminUser');


      // check if requestor is admin and the admin owns the form
      if (admin.role !== 'ADMIN' || form.adminUser.id !== adminId) { // TODO: put roles in constant
        throw Boom.forbidden('You do not have permission to update this form');
      }

      const updatedForm = await FormModel.query().insert({
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
};
