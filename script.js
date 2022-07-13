'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
//BANK INTL APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jaya Shree',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-05-29T23:36:17.929Z',
    '2022-05-31T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'John Doe',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    // const hour = date.getHours();

    // const min = date.getMinutes();

    return `${day}/${month}/${year}`;
  }
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;
//FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

//Experimenting with API
const now = new Date();
labelDate.textContent = new Intl.DateTimeFormat('en-IN').format(now);

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);

    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add Transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    //Add Transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
//In JS all numbers are represented as floating point numbers
console.log(23 === 23.0);
//so same type for all the numbers
//numbers are always stored in binary form i.e., 0s and 1s

//base 10 -> 0 to 9
console.log(1 / 10);
console.log(3 / 10);
//binary 2 -> 0,1
console.log(0.1 + 0.2); //weird result //error in js

//Conversion
console.log(Number('23'));
console.log(+'23');
//when is + is seen JS performs type coercion(automatically converts operands to numbers)
//So basically we can replace Number(any) with +(any)

//Parsing
//parse a number from string
console.log('Parsing');
console.log(Number.parseInt('23px'));
console.log(Number.parseInt('j23px')); //does not work
//ParseInt accepts second argument called radix(base of system ex: base 10 -> 0 to 9)
console.log(Number.parseInt('j23px', 10));
console.log(Number.parseInt('23px', 10));
console.log(Number.parseInt('23px', 2));

console.log(Number.parseFloat(' 2.5rem '));
console.log(Number.parseFloat(' 2rem '));

console.log(parseFloat(' 2.5rem '));
console.log(parseFloat(' 2rem '));
//As they are global no need to call it particularly on a function

//use only to check if a value is NaN
console.log('isNaN');
console.log(Number.isNaN(20)); // 20 is Not a Number = False
console.log(Number.isNaN('20')); //'20' is Not a Number = False
console.log(Number.isNaN(+'20X')); //
console.log(Number.isNaN(23 / 0)); //

//isFinite is th best way of checking if the value is  number than isNaN
//at least while working with floating point numbers
console.log('isFinite');
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isNaN(23 / 0));

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 34, -91, 34, 12, 100));
console.log(Math.max(5, 18, 34, -91, 34, 12, '100'));
console.log(Math.max(5, 18, 34, -91, 34, 12, '100px'));
console.log(Math.min(5, 18, 34, -91, 34, 12, 100));

console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6));

//number bn min to min
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 18));

//Rounding Integers
//All these methods Perform type Coercion as well
console.log('Trunc');
console.log(Math.trunc(23.9891));
console.log(Math.trunc(23.3891));
console.log('Round');
console.log(Math.round(23.9891));
console.log(Math.round(23.3891));
console.log('Ceil');
console.log(Math.ceil(23.9891));
console.log(Math.ceil(23.3891));
console.log('Floor +');
console.log(Math.floor(23.9891));
console.log(Math.floor(23.3891));
console.log(Math.floor('23.3891')); //Type Coercion
console.log('Floor - and TRunc -');
console.log(Math.floor(-23.3891));
console.log(Math.trunc(-23.3891));

//Rounding decimals
//toFixed returns a string always and NaN
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(1));
console.log((2.7).toFixed(2));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2)); //rounded to 2.35
console.log(+(2.345).toFixed(3)); //returns number as we included +

//NOTE:number is primitive and it does not have methods
//So bts JS does BOXING

//BOXING : primitive number is transformed to number object then call the method on that object
// and then converts it back to primitive

//Remainder Operator
console.log(5 % 2);
console.log(5 / 2);
console.log(8 % 3);
console.log(8 / 3);

const isEven = n => n % 2 === 0;
console.log(isEven(9));
console.log(isEven(12));
/*
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

//Nth


//Numeric Seperators:('_') to format numbers in a way to incread the readability
//287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const priceCents = 345_95;
console.log(priceCents);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI1 = 3.14_15;
console.log(PI1);
// const PI2 = 3._1415; // _ in the start ❌
// console.log(PI2);
// const PI3 = 3.1415_;  // _ in the end ❌
// console.log(PI3);

// strings that contain underscores cannot be converted to number
console.log(Number('234_578')); //❌ //NaN
console.log(parseInt('234_578')); //❌ //234

//When you get the data from API which is for sure to be converted to number so avoid using '_'

//BIGINT primitive type
//numbers are represented internally as 64 bits : i.e., 64 1's or 0's to represent any number
//but only 53 are used to store the digits
//the rest are used to store the position of decimal poinst and the signs
//So ultimately there is a limit on how big the number should be
console.log(2 ** 53 - 1);
//essentially the biggest number JS can safely represent and 2 as we are working with base 2
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1); //❌ unsafe result
console.log(2 ** 53 + 2); //❌ unsafe result

// So BIGINT came to the picture
console.log(76726676767724787897857829758978785789275n);
//n in the above makes the number to BigInt
console.log(BigInt(85789275));
//with BigInt() constructor function use smaller numbers

//Operations on BigInt are similar to operation s on regular numbers
//But you cannot mix regular numbers and bigInt numbers and perform operations
console.log(66246n + 47577573n);
console.log(76272678264726242738789729882n * 1000000000n);

const huge = 76272678264726242738789729882n;
const num = 23;
//console.log(huge * num);//❌
console.log(huge * BigInt(num)); //✅ //

// 🛑Two exceptions
//🛑 Comparision  operator Exception
console.log(20n > 15); // type coercion
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == 20); // type coercion

console.log(huge + '  is REALLY BIG!!');

//🛑 Math Operations does not work

//Divisions
console.log(10n / 3n); // returns closest BigInt
console.log(10 / 3);
console.log(11n / 3n); //cutdowns the decimal part
console.log(12n / 3n);


//🛑 DATES and TIM
//Create a Date
const now = new Date();
console.log(now);

//Parse date from string
console.log(new Date('Jun 01 2022 19:21:05'));
console.log(new Date('February 23, 1997')); //unsafe
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2050, 10, 19, 15, 23, 3));
console.log(new Date(2050, 10, 31)); //JS autocorrects Day to Dec 01

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

//These dates are special type of obhects and have their own methods


//Working with Dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay()); //months and weekdays begin from 0
console.log(future.getHours());
console.log(future.getMilliseconds());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(2142274980000)); //timestamp

//timestamp for current moment
console.log(Date.now());
future.setFullYear(2040);
console.log(future);
*/

//Operations on Dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(Number(future));
//console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
const days1 = calcDaysPassed(
  new Date(2037, 3, 4),
  new Date(2037, 3, 14, 10, 8)
);
console.log(days1);

//DATE LIBRARY MOMENT.JS FOR FREE✅
