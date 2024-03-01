'use strict';

const tableName = 'user_responses';

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.integer('form_id').unsigned().index().references('id').inTable('forms');
    table.integer('user_id').unsigned().index().references('id').inTable('users');
    table.integer('question_id').unsigned().index().references('id').inTable('questions');
    table.string('response')

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
