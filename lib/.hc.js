'use strict'

module.exports = {
  $default: {
    recursive: true,
    exclude: (filename, path) => path.match(/utils/) || path.match('.*\.test\.js')
  },
  recursive: true,
  usePathAsName: true,
};


