import { snackActions } from '@dashboard/libs/snackbar';

export const USDformatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const NumberFormatter = number => {
  return new Intl.NumberFormat(undefined, { maximumSignificantDigits: 6 }).format(number);
};

export const NumberFormatterDollar = number => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
};

export const crateNewDate = () => {
  return new Date();
};

export const getRandomNumber = () => {
  return Date.now();
};

export const GetTimeArrayList = () => {
  const timeArray = [];
  const d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();

  for (let i = 0; i < 24; i++) {
    for (m = (m + 30 - (m % 15)) % 60; m < 60; m = m + 15) {
      timeArray.push(h + ':' + m);
    }
    h = (h + 1) % 24;
    timeArray.push(h + ':00');
  }

  return timeArray;
};

export const EmailHideFormatter = mail => {
  let newMail = mail?.split('@');
  let newMailName = newMail?.[0];
  let mailDomain = newMail?.[1];
  newMail = newMailName?.[0] + newMailName?.[1] + newMailName?.[2] + '*****@' + mailDomain;
  return newMail;
};

export const fileSizeConverter = size => {
  const sizeLength = Number(String(size).length);
  var newSize;
  if (sizeLength >= 7) {
    newSize = (size / 1024 / 1024).toFixed(2);

    newSize = newSize + ' MB';
  } else if (sizeLength < 7) {
    newSize = (size / 1024).toFixed(2);
    newSize = newSize + ' KB';
  }

  return newSize;
};

export const capitalize = s => {
  return s[0].toUpperCase() + s.slice(1);
};

export const isObjEmpty = obj => {
  return Object.keys(obj).length === 0;
};

export const stringAvatar = name => {
  // Accepts one word, several, or nothing at all — a single-word name used to
  // throw here, which took the whole sidebar down.
  const words = String(name ?? '')
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '';
  if (words.length === 1) return words[0].slice(0, 2);
  return words[0][0] + words[words.length - 1][0];
};

export const checkPasswordStrength = password => {
  //If password contains both lower and uppercase characters
  let strength = 0;
  if (password?.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
    strength += 1;
  }
  //If it has numbers and characters
  if (password?.match(/([0-9])/)) {
    strength += 1;
  }
  //If it has one special character
  if (password?.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
    strength += 1;
  }
  //If password is greater than 7
  if (password?.length > 7) {
    strength += 1;
  }
  return strength;
};

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const toBase64NoStartingWithData = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',').pop());
    reader.onerror = error => reject(error);
  });

export const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
};

export const copyResult = async (text, successMessage) => {
  try {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
    } else {
      document.execCommand('copy', true, text);
    }
    await snackActions.success(successMessage);
  } catch (error) {
    await snackActions.error(error);
  }
};

export const deleteMultipleSpaces = text => {
  return text.replace(/  +/g, ' ');
};

export const deleteSpace = text => {
  return text.replace(/\s/g, '');
};

export const isObjectEmpty = objectName => {
  return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object;
};

export const GetMaxValueInArray = (array, key) => {
  return array.reduce((prev, current) => {
    return prev[key] > current[key] ? prev : current;
  });
};

export const TrimAll = text => {
  return text.replace(/^\s+|\s+$/gm, '');
};

export const isWhatPercentOf = (x, y) => {
  const result = 100 - (x / y) * 100;

  return result.toFixed(2);
};
