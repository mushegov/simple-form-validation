'use strict';

var form = document.querySelector('.main-form');
var birthDateInput = form.querySelector('#birth-date');
var sexSelect = form.querySelector('#sex');
var iinInput = form.querySelector('#iin');
var submit = form.querySelector('.submit');

var dateValue = birthDateInput.value;
var sexValue = sexSelect.value;
var iinValue = iinInput.value;


//
function isNumeric(num) {
  return !isNaN(num);
}

//
function checkIsFieldFilled(field) {
  if (field.value === '') {
    field.classList.add('empty');
    field.classList.remove('filled');
    return false;
  } else {
    field.classList.remove('empty');
    field.classList.add('filled');
    return true;
  }
}

//
function checkIsFormFilled() {
  var fields = form.querySelectorAll('.form-field');
  var isFilled = true;

  for (var i = 0; i < fields.length; i++) {
    if (fields[i].id !== 'iin') {
      if (!checkIsFieldFilled(fields[i])) {
        isFilled = false;
      }
    }
  }

  return isFilled;
}

//
function serializeDate(date) {
  var newDate = {
    century: date.slice(0, 2),
    year: date.slice(2, 4),
    month: date.slice(5, 7),
    day: date.slice(8, 10)
  };

  return newDate;
}

//
function calculateIinSevenDigit(date, sex) {
  var digit;
  var century = date.century;

  if (century === '18' && sex === 'male') {
    digit = 1;
  }
  if (century === '18' && sex === 'female') {
    digit = 2;
  }
  if (century === '19' && sex === 'male') {
    digit = 3;
  }
  if (century === '19' && sex === 'female') {
    digit = 4;
  }
  if (century === '20' && sex === 'male') {
    digit = 5;
  }
  if (century === '20' && sex === 'female') {
    digit = 6;
  }

  return digit;
}

//
function getIindate(date) {
  var iinDate = date.year + date.month + date.day;

  return iinDate;
}

//
function calculateIin() {
  if (dateValue !== '' && sexValue !== '') {
    var iinDate = getIindate(dateValue);
    var iinSevenDigit = calculateIinSevenDigit(dateValue, sexValue);

    iinValue = iinDate + iinSevenDigit;

    setIinPlaceholder(iinValue);

    return iinValue;
  }

  return false;
}

//
function setIinPlaceholder(iin) {
  var placeholder = iinInput.getAttribute('placeholder');

  var placeholderPostfix = placeholder.slice(7, 12);
  var iinPlaceholder = iin;

  iinInput.setAttribute('placeholder', iinPlaceholder + placeholderPostfix);
}

//
function validateControlDigit(iinTypedValue) {
  var testOneData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var testTwoData = [3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2];

  var testOneSum = 0;

  for (var i = 0; i < 11; i++) {
    testOneSum += testOneData[i] * iinTypedValue.slice(i, i + 1);
  }

  var mod = testOneSum % 11;

  if (mod !== 10) {
    return true;
  } else {
    var testTwoSum = 0;

    for (i = 0; i < 11; i++) {
      testTwoSum += testTwoData[i] * iinTypedValue.slice(i, i + 1);
    }

    mod = testTwoSum % 11;

    if (mod !== 10) {
      return true;
    }
  }

  return false;
}

//
function validateIin(iinTypedValue) {
  if (iinTypedValue.length === 12 && isNumeric(iinTypedValue)) {
    var typedIinPrefix = iinTypedValue.slice(0, 7);

    var isIinDateCorrect = typedIinPrefix === iinValue ? true : false;

    if (!isIinDateCorrect) {
      return false;
    }

    var isControlDigitCorrect = validateControlDigit(iinTypedValue);

    if (isIinDateCorrect && isControlDigitCorrect) {
      return true;
    }
  } else {
    iinInput.classList.add('empty');
    iinInput.classList.remove('filled');
  }

  return false;
}

//
function onBirhtDateInputChange() {
  dateValue = serializeDate(birthDateInput.value);
  checkIsFieldFilled(birthDateInput);

  calculateIin();
}

//
function onSexSelectChange() {
  sexValue = sexSelect.value;

  checkIsFieldFilled(sexSelect);

  calculateIin();
}

//
function onIinInputChange() {
  var isIinValid = validateIin(iinInput.value);

  if (!isIinValid) {
    iinInput.classList.add('empty');
    iinInput.classList.remove('filled');
  } else {
    iinInput.classList.remove('empty');
    iinInput.classList.add('filled');
  }
}

//
function onSubmitClick(evt) {
  evt.preventDefault();

  var isIinValid = validateIin(iinInput.value);
  var isFormFilled = checkIsFormFilled();

  if (isIinValid && isFormFilled) {
    showSuccessMessage();
  }
}

//
function showSuccessMessage() {
  var message = document.createElement('div');
  message.innerText = 'Форма заполнена верно!';
  message.classList.add('success-message');
  form.appendChild(message);
}

//
birthDateInput.addEventListener('change', onBirhtDateInputChange);
sexSelect.addEventListener('change', onSexSelectChange);
iinInput.addEventListener('change', onIinInputChange);

form.querySelector('#surname').addEventListener('change', function (evt) {
  checkIsFieldFilled(evt.target);
});

form.querySelector('#name').addEventListener('change', function (evt) {
  checkIsFieldFilled(evt.target);
});

form.querySelector('#patronym').addEventListener('change', function (evt) {
  checkIsFieldFilled(evt.target);
});

submit.addEventListener('click', onSubmitClick);
