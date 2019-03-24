'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStr = getStr;
exports.getTagData = getTagData;
exports.getImgIndex = getImgIndex;
exports.filterStr = filterStr;
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

  if (encode === 0 && data[0] !== 1) {
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
    if (data.lastIndexOf(254) !== -1) {
      data = data.slice(data.lastIndexOf(254) + 1);
      data = new Uint16Array(data.buffer);
    }

    tmpStr = getStr(0, data.length, data);
  }

  tmpStr = filterStr(tmpStr);
  return tmpStr;
}

function getImgIndex(data) {
  // PNG begin with 8950(137, 80) while JPG begin with FFD8(255, 216)
  var start = [255, 216];
  var format = 'jpeg';

  if (getStr(15, 18, data) === 'PNG') {
    start[0] = 137;
    start[1] = 80;
    format = 'png';
  }

  var i = 0;
  while (i < data.length) {
    if (start[0] === data[i] && start[1] === data[i + 1]) {
      break;
    }
    i++;
  }

  return {
    i: i,
    format: format
  };
}

function filterStr(str) {
  // delete the meaningless char
  var tmp = [String.fromCharCode(0), String.fromCharCode(255), '\f'];
  var tmpStr = '';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var val = _step.value;

      tmpStr += tmp.indexOf(val) !== -1 ? '' : val;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return tmpStr;
}