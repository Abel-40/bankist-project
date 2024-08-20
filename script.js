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
  locale: 'pt-PT',
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

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
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
  locale: 'pt-PT',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

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

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

//containers
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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/////////////////////////////////////////////////

function createMovement(accs, sort = false) {
  const acc = sort
    ? accs.movements.slice().sort((a, b) => a - b)
    : accs.movements;
  console.log(acc);
  containerMovements.innerHTML = '';
  acc.forEach((movement, index) => {
    let type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${movement}$</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function createUser(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
}
createUser(accounts);

let balance;
const currentBalance = function (acc) {
  balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.innerHTML = `${balance}€`;
};

const calcDisplaySummary = function (account) {
  labelSumIn.innerHTML = '';
  labelSumOut.innerHTML = '';
  labelSumInterest.innerHTML = '';

  const deposit = account.movements
    .filter(each => each > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const withdrawal = account.movements
    .filter(each => each < 0)
    .reduce((acc, cur) => {
      return acc + cur;
    }, account.movements[0]);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  const input = `<p class="summary__value summary__value--in">${deposit}€</p>`;
  labelSumIn.innerHTML = input;
  const out = `<p class="summary__value summary__value--out">${Math.abs(
    withdrawal
  )}€</p>`;
  labelSumOut.innerHTML = out;
  const inter = `<p class="summary__value summary__value--out">${Math.abs(
    interest
  )}€</p>`;
  labelSumInterest.innerHTML = inter;
};

//Update UI
function updateUi() {
  //to update summary
  calcDisplaySummary(currentAccount);

  //to update Movements
  createMovement(currentAccount);

  //to update currentBalance
  currentBalance(currentAccount);
}

// login
let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const user = inputLoginUsername.value;
  const pass = +inputLoginPin.value;
  currentAccount = accounts.find(
    acc => acc.username == user && acc.pin === pass
  );

  labelWelcome.textContent = `Wellcome, ${currentAccount?.owner.split(' ')[0]}`;

  inputLoginPin.value = '';
  inputLoginUsername.value = '';
  inputLoginPin.blur();
  inputLoginUsername.blur();
  if (currentAccount) {
    containerApp.style.opacity = 100;
    updateUi();
  } else {
    containerApp.style.opacity = 0;
  }

  //Transfer Money
  btnTransfer.addEventListener('click', e => {
    e.preventDefault();
    let receiverAcc = inputTransferTo.value;
    let transAmount = +inputTransferAmount.value;
    inputTransferTo.value = '';
    inputTransferTo.blur();
    inputTransferAmount.value = '';
    inputTransferAmount.blur();
    const transfer = accounts.find(acc => acc.username === receiverAcc);
    if (
      receiverAcc !== currentAccount.username &&
      balance > 0 &&
      balance > transAmount
    ) {
      transfer.movements.push(transAmount);
      console.log(transfer.movements);
      currentAccount.movements.push(-transAmount);
      updateUi();
    }
  });

  //Loan
  btnLoan.addEventListener('click', e => {
    e.preventDefault();
    let loanValue = +inputLoanAmount.value;

    if (
      loanValue > 0 &&
      currentAccount.movements.some(mov => mov >= loanValue * 0.1)
    ) {
      currentAccount.movements.push(loanValue);
    } else {
      console.log("we can't provide loan based on your current balance");
    }

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    updateUi();
  });

  //logout
  btnClose.addEventListener('click', e => {
    e.preventDefault();
    const user = inputCloseUsername.value;
    const pass = +inputClosePin.value;
    currentAccount = accounts.find(
      acc => acc.username == user && acc.pin === pass
    );

    inputClosePin.value = '';
    inputCloseUsername.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();
    if (currentAccount) {
      containerApp.style.opacity = 0;
    }
  });

  //sort transaction
  let sorted = false;
  btnSort.addEventListener('click', e => {
    e.preventDefault();
    createMovement(currentAccount, !sorted);
    sorted = !sorted;
  });
});

const today = new Date();
console.log(today);

console.log(new Date(3 * 24 * 60 * 60 * 1000));
