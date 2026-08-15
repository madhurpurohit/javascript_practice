// TODO: Task 1 - Structure an IIFE or Factory Function using Closures.
// - Keep the 'balance' and 'pin' variables strictly private inside the function scope.
// - These variables should NOT be accessible via the global window or console.
const bankApp = (function () {
  let pin = "7610";
  let balance = 10207;
  let validUser = false;

  return {
    verifyPin: function (enterPin) {
      if (enterPin === pin) {
        validUser = true;
        return true;
      }
      return false;
    },
    deposit: function (amount) {
      if (!validUser) return 0;
      balance += amount;
      return balance;
    },
    withdraw: function (amount) {
      if (!validUser) return 0;

      if (amount > balance) {
        return 0;
      }
      balance -= amount;
      return balance;
    },
    checkBalance: function () {
      if (!validUser) return 0;

      return balance;
    },
  };
})();

// TODO: Task 2 - Expose public methods
// - Return an object with methods: verifyPin, deposit, withdraw, and checkBalance.
// - Link these methods to the respective UI buttons.
// UI Logic
const screenDisplay = document.getElementById("screen-display");
const pinInput = document.getElementById("pin-input");
const keypadButtons = document.querySelectorAll(".keypad button");
const btnBalance = document.getElementById("btn-balance");
const btnDeposit = document.getElementById("btn-deposit");
const btnWithdraw = document.getElementById("btn-withdraw");

// Handle keypad input
keypadButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const val = e.target.innerText;
    if (val === "C") {
      pinInput.value = "";
    } else if (val === "OK") {
      console.log(pinInput.value);
      const isValid = bankApp.verifyPin(pinInput.value);
      screenDisplay.innerText = isValid ? "Authenticated!" : "Invalid PIN";
      pinInput.value = "";
    } else {
      pinInput.value += val;
    }
  });
});

// Handle transactions using the public API exposed by the closure
btnBalance.addEventListener("click", () => {
  screenDisplay.innerText = bankApp.checkBalance();
});

btnDeposit.addEventListener("click", () => {
  screenDisplay.innerText = bankApp.deposit(100); // Hardcoded $100 for demo
});

btnWithdraw.addEventListener("click", () => {
  screenDisplay.innerText = bankApp.withdraw(50); // Hardcoded $50 for demo
});
