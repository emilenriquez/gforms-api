'use strict';

const Confidence = require('@hapipal/confidence');
const Toys = require('@hapipal/toys');
const Dotenv = require('dotenv');

const environments = ['test', 'local', 'development'];
const dotEnvFile = environments.includes(process.env.NODE_ENV) ?
  `.env.${process.env.NODE_ENV}` :
  '.env';

Dotenv.config({ path: `${__dirname}/../${dotEnvFile}` });
console.log('ENV', `${__dirname}/../${dotEnvFile}`);



// Glue manifest as a confidence store
module.exports = new Confidence.Store({
  server: {
    host: 'localhost',
    port: {
      $param: 'PORT',
      $coerce: 'number',
      $default: 3000
    },
    debug: {
      $filter: 'NODE_ENV',
      $default: {
        log: ['error', 'start'],
        request: ['error']
      },
      production: {
        request: ['implementation']
      }
    },
  },
  register: {
    plugins: [
      {
        plugin: '../lib', // Main plugin
        options: {}
      },
      {
        plugin: './plugins/swagger'
      },
      {
        plugin: '@hapipal/schwifty',
        options: {
          $filter: 'NODE_ENV',
          $default: {},
          $base: {
            migrateOnStart: true,
            knex: {
              client: 'pg',
              connection: {
                host: process.env.DB_HOST || '',
                user: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || ''
              },
              seeds: {
                directory: './lib/seeds'
              }
            }
          },
          development: {
            knex: {
              client: 'pg',
              connection: {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USERNAME || 'postgreslocal',
                password: process.env.DB_PASSWORD || 'postgreslocal',
                database: process.env.DB_NAME || 'gforms'
              },
              seeds: {
                directory: './lib/seeds'
              },
              debug: true
            }
          },
          test: {
            migrateOnStart: true,
            knex: {
              client: 'pg',
              connection: {
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USERNAME || 'postgreslocal',
                password: process.env.DB_PASSWORD || 'postgreslocal',
                database: process.env.DB_NAME || 'gforms'
              },
              seeds: {
                directory: './lib/seeds'
              },
              debug: true
            }
          },
          production: {
            migrateOnStart: false,
            knex: {
              client: 'pg',
              connection: {
                host: process.env.DB_HOST || '',
                user: process.env.DB_USERNAME || '',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || ''
              },
              seeds: {
                directory: './lib/seeds'
              },
              debug: true
            }
          }
        }
      },
      {
        plugin: {
          $filter: 'NODE_ENV',
          $default: '@hapipal/hpal-debug',
          production: Toys.noop
        }
      }
    ]
  }
});
