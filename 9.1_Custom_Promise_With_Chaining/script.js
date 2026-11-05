"use strict";
let PromiseState;

(function (PromiseState) {
  PromiseState["PENDING"] = "pending";
  PromiseState["FULFILLED"] = "fulfilled";
  PromiseState["REJECTED"] = "rejected";
})(PromiseState || (PromiseState = {}));

class MyPromise {
  _state = PromiseState.PENDING;
  _successCallbackHandlers = [];
  _failureCallbackHandlers = [];
  _finallyCallbackHandlers = [];
  _value = undefined;
  _reason = undefined;
  constructor(executor) {
    // Execute the executor immediately, as the native Promise constructor does.
    // Convert any synchronous executor error into a rejection.
    try {
      executor(
        this._promiseResolver.bind(this),
        this._promiseRejector.bind(this),
      );
    } catch (error) {
      this._promiseRejector(error);
    }
  }
  then(handlerFn) {
    // Every call to then() must return a new promise.
    // This allows multiple then() calls to form a chain.
    return new MyPromise((resolve, reject) => {
      const successWrapper = (value) => {
        try {
          // If no success handler is supplied, forward the original value.
          if (typeof handlerFn !== "function") {
            resolve(value);
            return;
          }
          // Execute the handler and capture its return value.
          const result = handlerFn(value);
          // Resolve the next promise with the result.
          // The resolver adopts a returned MyPromise automatically.
          resolve(result);
        } catch (error) {
          // An exception inside the handler rejects the next promise.
          reject(error);
        }
      };
      if (this._state === PromiseState.FULFILLED) {
        // Handle a promise that has already been fulfilled.
        successWrapper(this._value);
      } else if (this._state === PromiseState.REJECTED) {
        // Skip the success handler and forward the rejection.
        reject(this._reason);
      } else {
        // Save the handler until the pending promise settles.
        this._successCallbackHandlers.push(successWrapper);
      }
    });
  }
  catch(handlerFn) {
    // catch() also returns a new promise so that the chain can continue.
    return new MyPromise((resolve, reject) => {
      const failureWrapper = (reason) => {
        try {
          // Execute the rejection handler to recover from the error.
          const result = handlerFn(reason);
          // A normal return value fulfills the next promise.
          // A returned MyPromise is adopted by the resolver.
          resolve(result);
        } catch (error) {
          // If the catch handler throws, propagate the new error.
          reject(error);
        }
      };
      if (this._state === PromiseState.REJECTED) {
        // Handle a promise that has already been rejected.
        failureWrapper(this._reason);
      } else if (this._state === PromiseState.FULFILLED) {
        // A fulfilled promise skips catch() and preserves its value.
        resolve(this._value);
      } else {
        // Save the rejection handler until rejection occurs.
        this._failureCallbackHandlers.push(failureWrapper);
      }
    });
  }
  finally(handlerFn) {
    // Return a new promise and preserve the original value or rejection.
    return new MyPromise((resolve, reject) => {
      const runFinally = () => {
        try {
          // Run the cleanup callback regardless of the settlement outcome.
          handlerFn();
          if (this._state === PromiseState.FULFILLED) {
            // Preserve the original fulfillment value.
            resolve(this._value);
          } else {
            // Preserve the original rejection reason.
            reject(this._reason);
          }
        } catch (error) {
          // An error thrown by finally() overrides the previous outcome.
          reject(error);
        }
      };
      if (this._state === PromiseState.PENDING) {
        // Wait for the original promise to settle before running finally().
        this._finallyCallbackHandlers.push(runFinally);
      } else {
        runFinally();
      }
    });
  }
  _promiseResolver(value) {
    // A promise can settle only once.
    if (this._state !== PromiseState.PENDING) return;
    // Reject direct self-resolution to prevent a circular dependency.
    if (value === this) {
      this._promiseRejector(
        new TypeError("A promise cannot resolve to itself."),
      );
      return;
    }
    // Adopt another MyPromise instead of fulfilling with the promise object.
    if (value instanceof MyPromise) {
      value
        .then((resolvedValue) => {
          this._promiseResolver(resolvedValue);
        })
        .catch((reason) => {
          this._promiseRejector(reason);
        });
      return;
    }
    // Fulfill this promise with a normal value.
    this._state = PromiseState.FULFILLED;
    this._value = value;
    // Execute all registered success handlers.
    this._successCallbackHandlers.forEach((callback) => {
      callback(this._value);
    });
    // Execute all registered finally handlers after settlement.
    this._finallyCallbackHandlers.forEach((callback) => callback());
    // Release callback references after execution.
    this._successCallbackHandlers = [];
    this._failureCallbackHandlers = [];
    this._finallyCallbackHandlers = [];
  }
  _promiseRejector(reason) {
    // A promise can settle only once.
    if (this._state !== PromiseState.PENDING) return;
    // Mark the promise as rejected and store the rejection reason.
    this._state = PromiseState.REJECTED;
    this._reason = reason;
    // Execute all registered rejection handlers.
    this._failureCallbackHandlers.forEach((callback) => {
      callback(this._reason);
    });
    // Execute all registered finally handlers after settlement.
    this._finallyCallbackHandlers.forEach((callback) => callback());
    // Release callback references after execution.
    this._successCallbackHandlers = [];
    this._failureCallbackHandlers = [];
    this._finallyCallbackHandlers = [];
  }
}
// Example: Test rejection handling and promise chaining.
const p = new MyPromise((resolve, reject) => {
  reject(new Error("Test error"));
});
p.then((value) => {
  // This handler should be skipped because the promise is rejected.
  console.log("This should not run:", value);
  return value * 2;
})
  .catch((error) => {
    // Handle the rejection and return a normal value.
    console.log("Caught:", error.message);
    return 100;
  })
  .then((value) => {
    // The recovered value from catch() should reach this handler.
    console.log("Recovered value:", value);
  })
  .finally(() => {
    // This callback runs after the preceding promise chain settles.
    console.log("Finally");
  });
