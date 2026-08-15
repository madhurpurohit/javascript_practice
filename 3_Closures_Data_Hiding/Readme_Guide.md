# 3. Closures and Data Hiding

## 1. Definition

A **Closure** is a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In JavaScript, closures are created every time a function is created, at function creation time. It gives a function access to its outer scope even after the outer function has returned. **Data Hiding** is a practical application of closures, used to encapsulate variables so they cannot be manipulated externally.

## 2. Interview Explanation

_Imagine an interviewer asks: "What is a closure and how do you use it to achieve encapsulation?"_

**Expert Response:**
"A closure occurs when an inner function retains access to the variables of its outer function, even after the outer function's execution context has been popped off the call stack. The JavaScript engine keeps that outer environment alive in memory because the inner function still holds a reference to it.

I use closures heavily for data hiding and encapsulation. By defining a variable inside a factory function or an IIFE, and then returning an object with methods that interact with that variable, I create a private state. The variables are entirely inaccessible from the global scope or the browser console, preventing unauthorized modifications. Only the privileged methods returned by the closure can read or mutate that state, ensuring robust data integrity."

## 3. Real-world Use Cases

- **State Management (Redux/Zustand):** Under the hood, state management libraries use closures to keep the application state private. You cannot modify the state directly; you must dispatch an action to a privileged reducer method.
- **API Wrappers & Authentication:** When building a service to interact with a third-party API, you can use a closure to keep the API Key or user tokens private, preventing malicious scripts (XSS attacks) from reading sensitive credentials from the global `window` object.

## 4. Step-By-Step Process (Practice Mode)

To build the secure ATM interface:

1. **Establish the Secure Environment:** Create an Immediately Invoked Function Expression (IIFE) or a standard factory function that will act as the bank's secure server.
2. **Declare Private State:** Inside this function, declare variables for the `pin` and the account `balance`. Do not attach these to the `window` or `this` keyword.
3. **Define Privileged Methods:** Create inner functions (methods) that can validate the PIN, deposit money, and withdraw money. These inner functions will form closures around the private state.
4. **Return Public API:** Return an object containing only these safe methods.
5. **Wire the UI:** Attach the returned methods to the physical HTML buttons (keypad, deposit, withdraw) to interact with the hidden state securely.
