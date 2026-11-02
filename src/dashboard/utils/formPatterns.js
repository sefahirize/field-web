const ListMailServices = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'live.com', 'outlook.com'];

export const PaternEmail = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: 'invalid email address',
};

export const validateBusinessEmail = mail => {
  var value = new RegExp(ListMailServices.join('|')).test(mail);
  if (value) {
    return 'Please enter a business email'; // return error message if string is not valid
  } else {
    return true; //return false for valid string
  }
};
