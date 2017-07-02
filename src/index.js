/**
 * Define and export mutag module.
 */
import fetchFile from './fetch';

// define the module API and version
const mutag = Object.create(null);
const version = '1.0.0';

mutag.version = version;
mutag['fetch'] = fetchFile;

// export the module for browser or nodejs
if (typeof window !== 'undefined') {
  window.mutag = mutag;
} else {
  exports.fetch = fetchFile;
  exports.version = version;
}
