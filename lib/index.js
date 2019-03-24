'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.fetch = undefined;

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// define the module version
var version = '2.0.3';

// export the module for nodejs
/**
 * Define and export mutag module.
 */
exports.fetch = _fetch2.default;
exports.version = version;