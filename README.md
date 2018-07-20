# Mutag
> A simple MP3 file tag parser.

[![npm](https://img.shields.io/npm/dt/mutag.svg?style=flat-square)](https://www.npmjs.com/package/mutag)
[![GitHub package version](https://img.shields.io/github/package-json/v/chunqiuyiyu/mutag.svg?style=flat-square)](https://github.com/chunqiuyiyu/mutag)
[![license](https://img.shields.io/github/license/chunqiuyiyu/mutag.svg?style=flat-square)](https://github.com/chunqiuyiyu/mutag/blob/master/LICENSE)

You can use it to get album photo, album name, date, style and other information in MP3 music files.

[中文文档](./doc/README.cn.md)

## Preview
[Demo](http://www.chunqiuyiyu.com/mutag/)

## Installation
```
npm install mutag
```

## Usage
In the browser, you should import  `dist/mutag.min.js`  and then use `window.mutag`.
```html
<script src="../dist/mutag.min.js"></script>
<script>
    const mutag = window.mutag;
    // the type of input element is 'file'
    const inputDOM = document.querySelector('.file-input');
    inputDOM.addEventListener('change', e => {
        const file = e.target.files[0];
        mutag.fetch(file).then((tags) => {
            //get all tags
            console.log(tags);
        });
    }, false);
```

In Node.js, Mutag should be introduced with the `require` method.
```javascript
const fs = require('fs');
const mutag = require('mutag');

fs.readFile('path/to/file.mp3', (err, data) => {
  mutag.fetch(data).then((tags) => {
    //get all tags
    console.log(tags);
  });
});
```

## API
### mutag.fetch(blob)
Parse the MP3 file and return a Promise object. The parameter is a Blob object. In the browser, the Blob object can be obtained by listening for the `onchange` event of the `input` (attribute `type="file"`), or by listening for the element's `ondrop` event, or passing Ajax. In Node.js, we can get it with the `fs.readFile()` API.
Return value is a Promise object. if there is no error, you can get all existing MP3 file tags in the callback function `resolve` with its `then` method.

### mutag.version
Return the version number of Mutag.

## Tag description
Mutag can parse ID3v2.3. Some common tags are as follows:

|Tag|Description
|:----:|:----|
|APIC|Attached picture, mostly in JPG format, few in PNG format|
|COMM|Comments, release notes for music files|
|GEOB|General encapsulated object|
|PRIV|Private frame, a series of private labels defined by Windows Media|
|TALB|Album/Movie/Show title|
|TCOM|Composer|
|TCON|Content type, music style, different numbers represent different styles, [here](https://github.com/chunqiuyiyu/mutag/blob/master/src/common/TCON.txt) are details.|
|TIT2|Title/songname/content description|
|TPE1|Lead performer(s)/Soloist(s)|
|TPUB|Publisher|
|TRCK|Track number/Position in set|
|TYER|Year|

For more information on tags, please check [here](https://github.com/chunqiuyiyu/mutag/blob/master/src/common/tags.txt).

## Browser compatibility
I use some newer APIs such as `TextDecoder`, `Blob`, and `FileReader`, so only modern browsers (new versions of Chrome, Firefox, Edge, etc.) are supported.

## License
MIT
