'use strict';

const tableName = 'users';

exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.string('first_name');
    table.string('last_name');
    table.string('email').index().unique().notNullable();
    table.string('password').notNullable();
    table.enum('role', ['USER', 'ADMIN']).defaultTo('USER');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
