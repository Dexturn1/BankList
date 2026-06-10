'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
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
// Display movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display balance
const calcAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

// Display summery
const calcDisplaySummary = Account => {
  const income = Account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = `${income.toFixed(2)}€`;

  const out = Account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = Account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * Account.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    });
  // labelSumInterest.textContent = `${interest.toFixed(2)}`;

  labelSumInterest.textContent = `${(income * 0.012).toFixed(2)}€`;
};

const createUsernames = accounts => {
  accounts.forEach(
    account =>
      (account.userName = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('')),
  );
};

createUsernames(accounts);

const updateUI = function (account) {
  //Display movements
  displayMovements(account.movements);
  //display balance
  calcAndDisplayBalance(account);
  //display summery
  calcDisplaySummary(account);
};

// Event Handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  // console.log('LOGIN');

  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value, // inputLoginUsername is the element
  );
  console.log(currentAccount);

  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);

    // //Display movements
    // displayMovements(currentAccount.movements);
    // //display balance
    // calcAndDisplayBalance(currentAccount);
    // //display summery
    // calcDisplaySummary(currentAccount);

    console.log('LOGIN');
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // is prevent the page from reloading after we click the button
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.userName === inputTransferTo.value,
  );

  console.log(amount, receiverAccount);
  if (
    amount > 0 &&
    // receiverAccount
    currentAccount.balance >= amount &&
    receiverAccount.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
    console.log(`Transfer Valid`);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    console.log('Delete');

    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName,
    );
    // console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = 0;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

// console.log(username);

// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//           i + 1
//         } ${type}</div>
//         <div class="movements__value">${mov}€</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${acc.balance}€`;
// };

// const calcDisplaySummary = function (acc) {
//   const incomes = acc.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumIn.textContent = `${incomes}€`;

//   const out = acc.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = `${Math.abs(out)}€`;

//   const interest = acc.movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * acc.interestRate) / 100)
//     .filter((int, i, arr) => {
//       // console.log(arr);
//       return int >= 1;
//     })
//     .reduce((acc, int) => acc + int, 0);
//   labelSumInterest.textContent = `${interest}€`;
// };

// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUsernames(accounts);

// const updateUI = function (acc) {
//   // Display movements
//   displayMovements(acc.movements);

//   // Display balance
//   calcDisplayBalance(acc);

//   // Display summary
//   calcDisplaySummary(acc);
// };

// ///////////////////////////////////////
// // Event handlers
// let currentAccount;

// btnLogin.addEventListener('click', function (e) {
//   // Prevent form from submitting
//   e.preventDefault();

//   currentAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value,
//   );
//   console.log(currentAccount);

//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     // Display UI and message
//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;
//     containerApp.style.opacity = 100;

//     // Clear input fields
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur();

//     // Update UI
//     updateUI(currentAccount);
//   }
// });

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     acc => acc.username === inputTransferTo.value,
//   );
//   inputTransferAmount.value = inputTransferTo.value = '';

//   if (
//     amount > 0 &&
//     receiverAcc &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // Doing the transfer
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();

//   const amount = Number(inputLoanAmount.value);

//   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
//     // Add movement
//     currentAccount.movements.push(amount);

//     // Update UI
//     updateUI(currentAccount);
//   }
//   inputLoanAmount.value = '';
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username,
//     );
//     console.log(index);
//     // .indexOf(23)

//     // Delete account
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }

//   inputCloseUsername.value = inputClosePin.value = '';
// });

// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovements(currentAccount.movements, !sorted);
//   sorted = !sorted;
// });

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// // LECTURES

///

// Coding Challenge #1

/*

Julia and Kate are doing a study on dogs. So each of them ask 5 dogs owners about their dogs's age, an stored the data into and array
(one array for each). For now they are just interested in knowing whether a dog is adult or a puppy. A dog is adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.


create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things: 

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! so create a shallow copy of Julia's (corrected) and kate's data

// */

// const julia1 = [3, 5, 2, 12, 7];
// const kate1 = [4, 1, 15, 8, 2];

// const julia2 = [9, 12, 6, 8, 3];
// const kate2 = [10, 5, 6, 1, 4];

// const checkDogs = function (julia, kate) {
//   // Removing the first and last element from the julia data
//   const correctedJulia = julia.slice(1, -1);

//   // Merge both arrays
//   const combineList = [...correctedJulia, ...kate];

//   // Analyze dogs
//   combineList.forEach(function (age, i) {
//     if (age < 3) {
//       console.log(`Dog number ${i + 1} is still a Puppy`);
//     } else {
//       console.log(`Dog number ${i + 1} is an adult`);
//     }
//   });
// };

// console.log(`TEST Data 1:`);

// const movements = [200, 450, 3000, -650, -130, 70, 1300];

// console.log(movements);

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movementsUSD);

// const movementDescriptions = movements.map(
//   (mov, i) =>
//     `movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`,
// );

// console.log(movementDescriptions);

// const deposits = movements.filter(mov => mov > 0);
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];

// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// Reduce

// // Accumulator -> SNOWBALL
// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// const bal = movements.reduce((acc, cur, i) => {
//   acc + cur;
// });

// console.log(bal);

// // MAXIMUM VALUE
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);

// const TestData1 = [5, 2, 4, 1, 15, 8, 3];
// const TestData2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = dogAge => {
//   if (dogAge <= 2) return 2 * dogAge;
//   else return 16 + dogAge * 4;
// };

// const dogsHumanAge = TestData1.map(age => calcAverageHumanAge(age));
// console.log(dogsHumanAge);

// const adultDogs = dogsHumanAge.filter(age => age >= 18);

// console.log(`Dogs with age greater then 18 in human years `);
// console.log(adultDogs);

// const avgAgeOfAdultDogs =
//   adultDogs.reduce((acc, cur) => acc + cur, 0) / adultDogs.length;

// console.log(avgAgeOfAdultDogs);

// const calcAverageHumanAge1 = ages => {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);
//   const avgAge = adults.reduce((acc, curr) => acc + curr, 0) / adults.length;
//   console.log(avgAge);
// };

// calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]);

// The Magic of Chaining Methods
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// console.log(movements);

// // PIPELINE

// const totalDepositsUSD = movements
//   .filter(mov => mov < 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// const calcAverageHumanAge = ages => {
//   return (
//     ages
//       .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//       .filter(age => age >= 18)
//       .reduce((acc, age, i, arr) => acc + age / arr.length),
//     0
//   );
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // const firstWithdrawal = movements.find(mov => mov < 0);
// // console.log(firstWithdrawal);

// // The new findLast and findLast Index Methods
// console.log(movements);
// const lastWithdrawal = movements.findLast(mov => mov < 0);
// console.log(lastWithdrawal);

// // your latest large movement was X movements age
// // here large mean greater then equal to 2000

// const latestLargeMovementIndex = movements.findLastIndex(
//   mov => Math.abs(mov) > 1000,
// );
// console.log(latestLargeMovementIndex);

// console.log(
//   `Your latest movement was ${movements.length - latestLargeMovementIndex} movement ago`,
// );

// console.log(movements.includes(-130)); // true or false

// console.log(movements.some(mov => mov > 0));

// console.log(movements.every(mov => mov > 0));
