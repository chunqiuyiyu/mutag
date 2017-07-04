/**
 * The id3v2.3 tag PRIV is complexable, so we need this file to parse it.
 */
export function parsePRIV (data, obj){
  switch(data.length) {
    case 14:
      // PeakValue
      obj['PeakValue'] = getHexStr(data);
      break;

    case 17:
      // AverageLevel
      obj['AverageLevel'] = getHexStr(data);
      break;

    case 28:
      // WM/UniqueFileIdentifier
      obj['WM/UniqueFileIdentifier'] = getIdentifiler(data.slice(24));
      break;

    case 31:
      // WM/WMContentID
      obj['WM/WMContentID'] = getId(data.slice(14));
      break;

    case 34:
      // WM/WMCollectionID
      obj['WM/WMCollectionID'] = getId(data.slice(17));
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

    case 44:
      // WM/Provider
      obj['WM/Provider'] = getStr(data.slice(11));
      break;

    default:
      break;
  }

  return obj;
}

function genGuidStr (guid) {
  let guidStr = '', tmp;
  // transform the typedArray to normal array for next step
  guid = Array.prototype.slice.call(guid);
  guid = guid.map(item => {
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

function getIdentifiler(data) {
  return data.reduce((prev, curr) => {
    if (prev === 59) {
      prev = ';'
    }

    return String(prev) + String(curr);
  });
}

function getId(data) {
  return data.reduce((prev, curr) => {
    return String(prev) + String(curr);
  });
}

function getStr(data) {
  let tmp = '';
  data.map((curr) => {
    tmp += String.fromCharCode(curr).replace(String.fromCharCode(0), '');
  });

  return tmp;
}
