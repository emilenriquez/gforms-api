'use strict';

const tableName = 'questions';

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.string('label').notNullable();
    table.integer('form_id').unsigned().index().references('id').inTable('forms');
    table.integer('group_number').unsigned().notNullable().defaultTo(0); // section
    table.enum('type', ['FREETEXT', 'SINGLE_CHOICE', 'MULTIPLE_SELECTION']).defaultTo('FREETEXT');
    table.boolean('is_required');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
