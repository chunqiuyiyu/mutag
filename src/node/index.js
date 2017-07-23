/**
 * Define and export mutag module.
 */
import fetchFile from './fetch';

// define the module version
const version = '2.0.2';

// export the module for nodejs
export {
  fetchFile as fetch,
  version
}
