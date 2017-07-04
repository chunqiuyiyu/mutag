/**
 * The usage of mutag in nodejs.
 */
const fs = require('fs');
const mutag = require('../lib/index.js');

fs.readFile('path/to/file.mp3', (err, data) => {
  mutag.fetch(data).then((tags) => {
    console.log(tags);
  });
});
