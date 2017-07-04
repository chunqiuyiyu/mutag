/**
 * Parse the code to String which people can Recognizable.
 */
export function getStr (start, len, data) {
  let tmp = '';
  for (let i = start; i < len; i++) {
    tmp += String.fromCharCode(data[i]);
  }

  return tmp;
}

export function getTagData(data, encode) {
  let seek = 0;
  let tmp, tmpStr = '';

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

  if (encode === 1 || (data[0] === 1 && encode === 0)) {
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

export function getImgIndex(data) {
  // PNG begin with 8950(137, 80) while JPG begin with FFD8(255, 216)
  const start = [255, 216];
  let format = 'jpeg';

  if (getStr(15, 18, data) === 'PNG') {
    start[0] = 137;
    start[1] = 80;
    format = 'png';
  }

  let i = 0;
  while (i < data.length)
  {
    if (start[0] === data[i] && start[1] === data[i + 1])
    {
        break;
    }
    i++;
  }

  return {
    i,
    format
  };
}

export function filterStr(str) {
  // delete the meaningless char
  const tmp = [String.fromCharCode(0), String.fromCharCode(255), '\f'];
  let tmpStr = '';
  for (let val of str) {
    tmpStr += (tmp.indexOf(val) !== -1) ? '' : val;
  }

  return tmpStr;
}
