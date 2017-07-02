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

  if (encode === 0) {
    while (seek < data.length) {
      if (data[seek] < 127 ) {
        tmpStr += String.fromCharCode(data[seek]);
        seek ++;
      } else {
        tmp = data.slice(seek, seek + 2);
        if (tmp.length == 1) {
          tmpStr += new TextDecoder('iso-8859-1').decode(tmp.buffer);
          seek ++;
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
    data = data.slice(data.lastIndexOf(254) + 1);
    data = new Uint16Array(data.buffer);
    tmpStr = getStr(0, data.length, data);
  }

  // delete the meaningless char
  tmpStr.replace(String.fromCharCode(0), '');
  return tmpStr;
}