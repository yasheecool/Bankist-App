'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

containerApp.style.visibility = 'hidden';

function displayMovements({ movements }) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, idx) => {
    const movementType = mov < 0 ? `withdrawal` : 'deposit';

    const htmlStr = `
      <div class="movements__row">
      
        <div class="movements__type movements__type--${movementType}">
        ${idx + 1}. ${movementType}</div>

        <div class="movements__date">3 days ago</div>

        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlStr);
  });
}

function parseUsername(accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
parseUsername(accounts);

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((acc, val) => acc + val);
  labelBalance.textContent = `${account.balance}€`;
}

function calcDisplaySummary(account) {
  const credits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, val) => acc + val);

  labelSumIn.textContent = `${credits}€`;

  const debits = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, val) => acc + val, 0);

  labelSumOut.textContent = `${debits}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int)
    .toFixed(2);

  labelSumInterest.textContent = `${interest}€`;
}

//Event Handler
let currentAccount;

btnLogin.addEventListener('click', evt => {
  evt.preventDefault();

  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount !== undefined) handleLogin(currentAccount);
  else console.log('Account not found/Wrong pin');

  inputLoginPin.value = inputLoginUsername.value = ''; //Clear Input Fields
});

function handleLogin(account) {
  labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`;

  calcDisplayBalance(account);
  displayMovements(account);
  calcDisplaySummary(account);
  containerApp.style.visibility = 'visible';
}

btnTransfer.addEventListener('click', evt => {
  evt.preventDefault();
  const recipient = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmt = Math.abs(Number(inputTransferAmount.value));

  if (
    recipient &&
    transferAmt <= currentAccount.balance &&
    currentAccount.username !== recipient
  ) {
    currentAccount.movements.push(-transferAmt);
    recipient.movements.push(transferAmt);

    calcDisplayBalance(currentAccount);
    displayMovements(currentAccount);
    calcDisplaySummary(currentAccount);

    inputTransferAmount.value = '';
    inputTransferTo.value = '';
  } else console.log('recipient undefined/funds na');
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const requestedAmt = Number(inputLoanAmount.value);
  inputLoanAmount.textContent = '';

  if (currentAccount.movements.some(mov => mov >= 0.1 * requestedAmt)) {
    currentAccount.movements.push(requestedAmt);
    displayMovements(currentAccount);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
  } else console.log('Condition not fulfilled');
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  const accToBeDeleted = accounts.find(
    acc =>
      acc.username === inputCloseUsername.value &&
      acc.pin === Number(inputClosePin.value)
  );

  if (accToBeDeleted === currentAccount)
    console.log(
      `Account Deleted`,
      accounts.splice(accounts.indexOf(currentAccount), 1)
    );

  inputCloseUsername.value = '';
  inputClosePin.value = '';
  labelWelcome.textContent = 'Log in to get started';

  if (!accounts.includes(currentAccount))
    containerApp.style.visibility = 'hidden';
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));

//SPLICE
// console.log(arr);
// // console.log(arr.splice(1, 2, 'Yash', 'Harsh'));
// console.log(arr);

// const arr2 = ['e', 'd', 'c', 'b', 'a'];
// console.log(arr2);

// const nameArr = ['y', 'a', 's', 'h'];
// console.log(typeof nameArr.join(''));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(-3));

//FOR EACH
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.forEach((val, idx, arr) => {
//   if (val > 0) console.log(`You deposited ${val} : Transaction ${idx + 1}`);
//   else console.log(`You withdrew ${Math.abs(val)}: Transaction ${idx + 1}`);
// });

//FOR EACH with MAPS and SETS

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((val, key, map) => console.log(key));

// const currenciesUnique = new Set(['USD', 'INR', 'USD', 'EUR', 'GBP']);

// currenciesUnique.forEach((val, idx, set) => console.log(val, idx, set));

///////////////////-------START-----////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// function checkDogs(dogsJulia, dogsKate) {
//   const dogsJuliaCopy = [...dogsJulia];

//   const dogsArr = [...dogsJuliaCopy.splice(1, 2), ...dogsKate];
//   dogsArr.forEach((age, i) => {
//     const logStr = `Dog number ${i + 1} is ${
//       age >= 3 ? `an adult, and is ${age} years old 🐕` : `still a puppy 🐶`
//     }`;

//     console.log(logStr);
//   });
// }

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// function calcAverageHumanAge(ages) {
//   const humanAge = ages.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   const adultDogs = humanAge.filter(age => age >= 18);
//   const avgHumanAge =
//     adultDogs.reduce((acc, val) => acc + val) / adultDogs.length;

//   return avgHumanAge;
// }

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

*/
// const calcAverageHumanAge = ages =>
//   ages
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, val, _, arr) => acc + val / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//-------------END------------

// //MAP
// const eurToUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const movementsUSD = movements.map(mov => Math.round(mov * eurToUsd));

// console.log(movements);
// console.log(movementsUSD);

//FILTER METHOD

// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);

//REDUCE METHOD
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements.reduce((acc, val) => (val > acc ? val : acc), 0)); //Max value

//CHAINING METHODS
// const eurToUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, val) => acc + val);

//FIND METHOD
// const movements = [199, 200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements.find((val, idx, arr) => val <= 201));

// const x = new Array(7);
// x.fill(5, 0, 6);

// const myArr = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(myArr);

// document.querySelector('.balance__value').addEventListener('click', () => {
//   const movements = [];
//   const nodeList = document.querySelectorAll('.movements__value');
//   const movtsArr = Array.from(nodeList);

//   movtsArr.forEach(mov =>
//     movements.push(Number(mov.textContent.replace('€', '')))
//   );

//   console.log(movements);
// });

// //Array Methods Practice

// //1
// const totalDeposits = accounts
//   .flatMap(acc => acc.movements)
//   .filter(val => val >= 0)
//   .reduce((acc, val) => acc + val);

// console.log(totalDeposits);

// //2
// const highValDeposits = accounts
//   .flatMap(acc => acc.movements)
//   .filter(val => val >= 1000).length;

// console.log(highValDeposits);

// const highValDeposits1 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);

// console.log(highValDeposits1);

// //3
// const sums = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (obj, mov) => {
//       mov > 0 ? (obj.credits += mov) : (obj.debits += mov);
//       return obj;
//     },
//     { credits: 0, debits: 0 }
//   );

// console.log(sums);

// //4
// //This Is a Nice Title
// function convertTitleCase(title) {
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'with', 'in'];

//   const newTitle = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       exceptions.includes(word)
//         ? word
//         : word.replace(word[0], word[0].toUpperCase())
//     )
//     .join(' ');

//   return newTitle;
// }

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:

GOOD LUCK 😀
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1
dogs.forEach(
  dog => (dog.recommendedFood = Math.round(dog.weight ** 0.75 * 28))
);

//2
for (const dog of dogs) {
  if (dog.owners.includes('Sarah')) {
    if (dog.curFood < dog.recommendedFood * 0.9)
      console.log(`Sarah's dog is eating too little`);
    else if (dog.curFood > dog.recommendedFood * 1.1)
      console.log(`Sarah's dog is eating too much`);
    else console.log(`Sarah's dog is eating an okay amount of food.`);
  }
}

console.log(dogs);

//3
const dogsEatingMuch = [];
const dogsEatingLittle = [];

dogs.forEach(dog => {
  if (dog.curFood > dog.recommendedFood * 1.1)
    dogsEatingMuch.push(...dog.owners);
  else if (dog.curFood < dog.recommendedFood * 0.9)
    dogsEatingLittle.push(...dog.owners);
});

console.log(dogsEatingMuch);
console.log(dogsEatingLittle);

//4
console.log(`${dogsEatingMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${dogsEatingLittle.join(' and ')}'s dogs eat too much!`);

//5
for (const dog of dogs)
  if (dog.curFood === dog.recommendedFood) console.log(true);

//6 7
const dogEatingOkayAmount = [];

for (const dog of dogs)
  if (
    dog.curFood <= dog.recommendedFood * 1.1 &&
    dog.curFood >= dog.recommendedFood * 0.9
  ) {
    console.log(true);
    dogEatingOkayAmount.push(dog);
  }

//8
const dogsCopy = [...dogs];

dogsCopy.sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy);
