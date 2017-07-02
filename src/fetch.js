/**
 * Read mp3 file as binary data.
 */
import {parsePRIV} from './parse';
import {getStr, getTagData} from './utils';

export default function fetchFile(file) {
  let data = file, reader;
  if (typeof FileReader !== 'undefined') {
    reader = new FileReader();
    reader.readAsArrayBuffer(file);
  }
  const readerPromise = new Promise((resolve, reject) => {
    if(typeof reader !== 'undefined') {
      reader.onload = () => {
        data = new Uint8Array(reader.result);
        parseFile(data, resolve);
      }
    } else {
      parseFile(data, resolve);
    }
  });

  return readerPromise;
}

function parseFile (data, resolve) {
  var header = data.slice(0, 10);
  var size = header[9] & 0x7f
           | ((header[8] & 0x7f) << 7)
           | ((header[7] & 0x7f) << 14)
           | ((header[6] & 0x7f) << 21);

  const mp3ID = getStr(0, 3, header);
  // current TAG version is ID3v2.3
  if (mp3ID === 'ID3' && header[3] === 3) {
    data = data.slice(10);
    // if there has extend tag header, skip it
    if ((header[5] & 0x40) === 0x40)
    {
      size -= 10;
      data = data.slice(10);
    }
    const tags = readFrame(data, size);
    resolve(tags);

  } else {
    throw new Error('the format of mp3 file is not correct or there has no id3v2.3 tag!')
  }
}

function readFrame(data, size) {
  var frame, frameID, imageData, tmp, encode, frameSize= 0, seek = 0, tags = Object.create(null);
  tags['PRIV'] = Object.create(null);
  while (seek < size) {
    frame = data.subarray(seek, seek + 10);
    encode = data[10];
    frameID = getStr(0, 4, frame);
    frameSize = frame[4] * 0x10000000 + frame[5] * 0x10000 + frame[6] * 0x100 + frame[7];
    if (frameSize == 0) break;
    seek += 10 + frameSize;
    tmp = data.subarray(seek - frameSize, seek);

    if (frameID === 'APIC') {
      let i = 0;
      while (i < tmp.length)
      {
        if (255 === tmp[i] && 216 === tmp[i + 1])
        {
            break;
        }
        i++;
      }

      imageData = tmp.subarray(i, frameSize);
      if (typeof Blob !== 'undefined') {
        imageData = new Blob([imageData], {type: 'image/jpeg'});
      }
      tags[frameID] = imageData;
    } else if (frameID === 'PRIV') {
      parsePRIV(tmp, tags['PRIV']);
    } else {
      tags[frameID] = getTagData(tmp, encode);
    }
  }

  !Object.keys(tags['PRIV']).length && delete tags.PRIV;
  return tags;
}
