/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _fetch = __webpack_require__(1);

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// define the module API and version
var mutag = Object.create(null); /**
                                  * Define and export mutag module.
                                  */

var version = '1.0.0';

mutag.version = version;
mutag['fetch'] = _fetch2.default;

// export the module for browser or nodejs
if (typeof window !== 'undefined') {
  window.mutag = mutag;
} else {
  exports.fetch = _fetch2.default;
  exports.version = version;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchFile;

var _parse = __webpack_require__(2);

var _utils = __webpack_require__(3);

/**
 * Read mp3 file as binary data.
 */
function fetchFile(file) {
  var data = file,
      reader = void 0;
  if (typeof FileReader !== 'undefined') {
    reader = new FileReader();
    reader.readAsArrayBuffer(file);
  }
  var readerPromise = new Promise(function (resolve, reject) {
    if (typeof reader !== 'undefined') {
      reader.onload = function () {
        data = new Uint8Array(reader.result);
        parseFile(data, resolve);
      };
    } else {
      parseFile(data, resolve);
    }
  });

  return readerPromise;
}

function parseFile(data, resolve) {
  var header = data.slice(0, 10);
  var size = header[9] & 0x7f | (header[8] & 0x7f) << 7 | (header[7] & 0x7f) << 14 | (header[6] & 0x7f) << 21;

  var mp3ID = (0, _utils.getStr)(0, 3, header);
  // current TAG version is ID3v2.3
  if (mp3ID === 'ID3' && header[3] === 3) {
    data = data.slice(10);
    // if there has extend tag header, skip it
    if ((header[5] & 0x40) === 0x40) {
      size -= 10;
      data = data.slice(10);
    }
    var tags = readFrame(data, size);
    resolve(tags);
  } else {
    throw new Error('the format of mp3 file is not correct or there has no id3v2.3 tag!');
  }
}

function readFrame(data, size) {
  var frame,
      frameID,
      imageData,
      tmp,
      encode,
      frameSize = 0,
      seek = 0,
      tags = Object.create(null);
  tags['PRIV'] = Object.create(null);
  while (seek < size) {
    frame = data.subarray(seek, seek + 10);
    encode = data[10];
    frameID = (0, _utils.getStr)(0, 4, frame);
    frameSize = frame[4] * 0x10000000 + frame[5] * 0x10000 + frame[6] * 0x100 + frame[7];
    if (frameSize == 0) break;
    seek += 10 + frameSize;
    tmp = data.subarray(seek - frameSize, seek);

    if (frameID === 'APIC') {
      var i = 0;
      while (i < tmp.length) {
        if (255 === tmp[i] && 216 === tmp[i + 1]) {
          break;
        }
        i++;
      }

      imageData = tmp.subarray(i, frameSize);
      if (typeof Blob !== 'undefined') {
        imageData = new Blob([imageData], { type: 'image/jpeg' });
      }
      tags[frameID] = imageData;
    } else if (frameID === 'PRIV') {
      (0, _parse.parsePRIV)(tmp, tags['PRIV']);
    } else {
      tags[frameID] = (0, _utils.getTagData)(tmp, encode);
    }
  }

  !Object.keys(tags['PRIV']).length && delete tags.PRIV;
  return tags;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePRIV = parsePRIV;
/**
 * The id3v2.3 tag PRIV is complexable, so we need this file to parse it.
 */
function parsePRIV(data, obj) {
  switch (data.length) {
    case 14:
      // PeakValue
      obj['PeakValue'] = getHexStr(data);
      break;

    case 17:
      // AverageLevel
      obj['AverageLevel'] = getHexStr(data);
      break;

    case 39:
      // WM/MediaClassPrimaryID
      data = data.slice(-16);
      data = genGuidStr(data);
      obj['WM/MediaClassPrimaryID'] = data;
      break;

    case 41:
      // WM/MediaClassSecondaryID
      data = data.slice(-16);
      data = genGuidStr(data);
      obj['WM/MediaClassSecondaryID'] = data;
      break;

    default:
      break;
  }

  return obj;
}

function genGuidStr(guid) {
  var guidStr = '',
      tmp = void 0;
  // transform the typedArray to normal array for next step
  guid = Array.prototype.slice.call(guid);
  guid = guid.map(function (item) {
    return item.toString(16);
  });

  tmp = guid.slice(0, 4);
  tmp.reverse();
  guidStr += tmp.join('') + '-';

  tmp = guid.slice(4, 6);
  tmp.reverse();
  guidStr += tmp.join('') + '-';

  tmp = guid.slice(6, 8);
  tmp.reverse();
  guidStr += tmp.join('') + '-';

  tmp = guid.slice(8, 10);
  guidStr += tmp.join('') + '-';

  tmp = guid.slice(10, 16);
  guidStr += tmp.join('');

  return guidStr;
}

function getHexStr(data) {
  data = data.slice(-4, -2);
  return data[0].toString(16) + data[1].toString(16);
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStr = getStr;
exports.getTagData = getTagData;
/**
 * Parse the code to String which people can Recognizable.
 */
function getStr(start, len, data) {
  var tmp = '';
  for (var i = start; i < len; i++) {
    tmp += String.fromCharCode(data[i]);
  }

  return tmp;
}

function getTagData(data, encode) {
  var seek = 0;
  var tmp = void 0,
      tmpStr = '';

  if (encode === 0) {
    while (seek < data.length) {
      if (data[seek] < 127) {
        tmpStr += String.fromCharCode(data[seek]);
        seek++;
      } else {
        tmp = data.slice(seek, seek + 2);
        if (tmp.length == 1) {
          tmpStr += new TextDecoder('iso-8859-1').decode(tmp.buffer);
          seek++;
        } else {
          tmp = new Uint16Array(tmp.buffer);
          tmpStr += new TextDecoder('gbk').decode(tmp.buffer);
          seek += 2;
        }
      }
    }
  }

  if (encode === 1 || data[0] === 1 && encode === 0) {
    // the utf-16 string begin with FF FE -> 255 254
    data = data.slice(data.lastIndexOf(254) + 1);
    data = new Uint16Array(data.buffer);
    tmpStr = getStr(0, data.length, data);
  }

  // delete the meaningless char
  tmpStr.replace(String.fromCharCode(0), '');
  return tmpStr;
}

/***/ })
/******/ ]);