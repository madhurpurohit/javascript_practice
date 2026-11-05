const PromiseState = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

class MyPromise {
  constructor(executor) {
    // Set initial state & variables
    this._state = PromiseState.PENDING;
    this._successCallbackHandlers = [];
    this._failureCallbackHandlers = [];
    this._finallyCallbackHandler = undefined;
    this._value = undefined;
    this._reason = undefined;

    // Call the executor immediately & bind the context of this.
    executor(
      this._promiseResolver.bind(this),
      this._promiseRejector.bind(this),
    );
  }

  then(handlerFn) {
    if (this._state === PromiseState.FULFILLED) {
      handlerFn(this._value);
    } else {
      this._successCallbackHandlers.push(handlerFn);
    }
    return this;
  }

  catch(handlerFn) {
    if (this._state === PromiseState.REJECTED) {
      handlerFn(this._reason);
    } else {
      this._failureCallbackHandlers.push(handlerFn);
    }
    return this;
  }

  finally(handlerFn) {
    if (this._state !== PromiseState.PENDING) {
      return handlerFn();
    }
    this._finallyCallbackHandler = handlerFn;
  }

  _promiseResolver(value) {
    if (this._state === PromiseState.FULFILLED) return;
    this._state = PromiseState.FULFILLED;
    this._value = value;
    this._successCallbackHandlers.forEach((cb) => cb(value));
    if (this._finallyCallbackHandler) this._finallyCallbackHandler();
  }

  _promiseRejector(reason) {
    if (this._state === PromiseState.REJECTED) return;
    this._state = PromiseState.REJECTED;
    this._reason = reason;
    this._failureCallbackHandlers.forEach((cb) => cb(reason));
    if (this._finallyCallbackHandler) this._finallyCallbackHandler();
  }
}

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Data mil gaya!");
  }, 1000);
});

p.then((data) => console.log(data))
  .catch((err) => console.error(err))
  .finally(() => console.log("Done!"));
