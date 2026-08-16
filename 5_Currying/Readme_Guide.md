# 12. Currying

## 1. Definition
**Currying** is a functional programming technique where a function that takes multiple arguments is transformed into a sequence of nested functions, each taking a single argument. Instead of calling `f(a, b, c)`, you call `f(a)(b)(c)`. 

## 2. Interview Explanation
*Imagine an interviewer asks: "What is currying and why is it useful in JavaScript?"*

**Expert Response:**
"Currying transforms a multi-arity function into a series of unary (single-argument) functions. It utilizes closures to remember the arguments passed in previous calls.

Why do we do this? It allows for **Partial Application**. If I have a generic function that takes three arguments, I can pass the first argument and generate a *new*, specialized function waiting for the remaining two. This reduces repetitive code. If you are logging events and the `appName` is always the same, you curry the function, pass the `appName` once, and pass the resulting specialized function around your codebase. It makes code highly modular, predictable, and heavily aligns with the DRY (Don't Repeat Yourself) principle."

## 3. Real-world Use Cases
- **Reusable Utility Functions:** Math operations or string formatters. A generic `multiply(a, b)` can be curried to create a specialized `double` function by executing `const double = curriedMultiply(2)`.
- **Middleware and Event Handlers:** In React, when assigning an onClick handler inside a mapped list, developers often curry the handler: `onClick={handleDelete(itemId)}`. The first call accepts the ID and returns the actual event handler function expected by React, pre-loaded with the specific ID.

## 4. Step-By-Step Process (Practice Mode)
To build the Analytics Tracker:
1. **Create the Curried Function:** Write a function `trackEvent(appName)`. This function should return another function that accepts `(eventType)`. *That* function should return a final function that accepts `(elementId)` and executes the actual `console.log` (or DOM update).
2. **Partial Application:** Call `trackEvent('MyApp')` and store the result in a variable (e.g., `appTracker`). You have now locked in the app name.
3. **Further Specialization:** Create specific trackers using `appTracker` for 'Click', 'Purchase', and 'Login' events.
4. **Wire to UI:** Attach the final specialized functions to the respective HTML buttons so they trigger the final execution step.

## 5. Code Solution (Reference)

```javascript
const logDiv = document.getElementById('log');

function logToUI(message) {
    logDiv.innerHTML += `> ${message}<br>`;
    logDiv.scrollTop = logDiv.scrollHeight; // Auto-scroll
}

// TODO: Task 1 - Build a Curried tracking function.
// Standard function: function track(app, event, element) { ... }
// Curried function:
const trackEvent = function(appName) {
    return function(eventType) {
        return function(elementId) {
            // Reaches here only when all 3 arguments are finally provided
            const msg = `[${appName}] ${eventType} triggered on #${elementId}`;
            console.log(msg);
            logToUI(msg);
        };
    };
};

// Modern Arrow Function Syntax for Currying (Much cleaner):
// const trackEvent = appName => eventType => elementId => { ... }

// TODO: Task 2 - Implement it manually using Partial Application
// 1. Lock in the App Name (Partial Application)
const myAppTracker = trackEvent('ECommerce_WebApp');

// 2. Lock in specific Event Types based on the App Tracker
const trackClickEvent = myAppTracker('User_Click');
const trackPurchaseEvent = myAppTracker('Payment_Success');
const trackLoginEvent = myAppTracker('Auth_Login');

// 3. Final Execution attached to UI Elements
// We pass the final argument (elementId) when the button is clicked.
document.getElementById('btn-click').addEventListener('click', () => {
    trackClickEvent('btn-click'); // Executes the final inner function
});

document.getElementById('btn-purchase').addEventListener('click', () => {
    trackPurchaseEvent('checkout-cart'); 
});

document.getElementById('btn-login').addEventListener('click', () => {
    trackLoginEvent('nav-login-modal');
});
```
