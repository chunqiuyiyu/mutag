/**
 * Define and export mutag module.
 */
import fetchFile from './fetch';

// define the module API and version
const mutag = Object.create(null);
const version = '2.0.3';

mutag.version = version;
mutag.fetch = fetchFile;

// export the module for browser
window.mutag = mutag;
