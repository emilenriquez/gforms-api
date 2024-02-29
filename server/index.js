'use strict';

const Glue = require('@hapi/glue');
const Exiting = require('exiting');
const Manifest = require('./manifest');

const { convertObjectKeys, toCamelCase } = require('../lib/utils');


exports.deployment = async ({ start } = {}) => {

  const manifest = Manifest.get('/', process.env);
  const server = await Glue.compose(manifest, { relativeTo: __dirname });

  server.ext('onPreHandler', (request, h) => {
    if (request.payload) {
      request.payload = convertObjectKeys(request.payload, toCamelCase);
    }

    return h.continue;
  });





  if (start) {
    await Exiting.createManager(server).start();
    server.log(['start'], `Server started at ${server.info.uri}`);
    return server;
  }

  await server.initialize();

  return server;
};

if (require.main === module) {

  exports.deployment({ start: true });

  process.on('unhandledRejection', err => {

    throw err;
  });
}
