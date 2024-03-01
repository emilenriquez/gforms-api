/* eslint-disable max-lines */
'use strict';

const Boom = require('@hapi/boom');
const Schmervice = require('@hapipal/schmervice');


module.exports = class UserResponseService extends Schmervice.Service {
  async getResponsesByForm(formId, requestorId) {
    throw new Error('implement this!')
  }

  async getById(id) {
    throw new Error('implement this!')
  }

  async getAll() {
    throw new Error('implement this!')
  }

  async create(payload, loggedInUser) {
    const {
      UserResponse: UserResponseModel,
      Question: QuestionModel,
    } = this.server.models();

    const trx = await UserResponseModel.startTransaction();
    try {
      const { formId, responses } = payload;

      const formService = this.server.services().formService;
      const form = await formService.getById(payload.formId);

      if(!form) {
        throw Boom.notFound('form not found!');
      }

      // check if user has already filled up the form
      // user can only submit the response once
      const existingResponses = await UserResponseModel.query()
        .where('user_id', loggedInUser.id)
        .andWhere('form_id', formId);

      if (existingResponses.length > 0) {
        throw Boom.badRequest('user has already submitted the form!')
      }

      // TODO: check if there are responses that are not in the questions for the given form


      const validatedResponses = form?.questions.reduce((acc, question) => {

        const response = responses.find(resp => resp.question_id === question.id)

        // check if there are questions that are required and not given any responses
        if(question.is_required && !response) {
          return {
            ...acc,
            error: {
              ...acc.error,
              [question.id]: `Question id ${question.id} is required!`
            }
          }
        }

        return {
          ...acc,
          success: {
            ...acc.success,
            [question.id]: response
          }
        }
      }, {
        success: {},
        error: {}
      })

      // if has error return error!
      if(Object.values(validatedResponses.error).length){
        throw Boom.badRequest(JSON.stringify(Object.values(validatedResponses.error)))
      };

      const newUserResponses = await UserResponseModel.query(trx)
        .insertGraph(
          Object.values(validatedResponses.success).map(response => ({
            user_id: loggedInUser.id,
            form_id: formId,
            question_id: response.question_id,
            response: response.response,
          })
        )).returning('id');

      await trx.commit();

      return newUserResponses;
    }
    catch (error) {
      await trx.rollback();
      throw error;
    }
  }
};
