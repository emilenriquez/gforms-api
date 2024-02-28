'use strict';

const tableName = 'options';

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.string('value').notNullable();
    table.integer('question_id').unsigned().index().references('id').inTable('questions');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
