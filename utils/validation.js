export const checkEmpty = (obj) => {
  let ans = false;

  if (Object.keys(obj).length === 0) {
    ans = true;
  } else {
    for (var key in obj) {
      if (obj[key].trim() == "") {
        ans = true;
        break;
      }
    }
  }

  return ans;
};

export const isPhoneNoValid = (no) => {
  if (/^(0|91)?[6-9][0-9]{9}$/.test(no)) {
    return true;
  } else return false;
};

export const isEmailValid = (email) => {
  //   return true;
  if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) return true;
  else return false;
};

export const isPANValid = (pan) => {
  if (/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(pan)) return true;
  return false;
};
