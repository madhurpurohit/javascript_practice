# 4. IIFE and Module Pattern

## 1. Definition

An **IIFE** (Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is defined. The **Module Pattern** is a design pattern used to implement software modules, leveraging IIFEs and closures to encapsulate "private" state and organization, returning only a "public" API. It is the precursor to modern ES6 modules.

## 2. Interview Explanation

_Imagine an interviewer asks: "Before ES6 modules existed, how did developers prevent global namespace pollution?"_

**Expert Response:**
"Before ES6 `import`/`export`, developers relied heavily on the Module Pattern via IIFEs to encapsulate logic. By wrapping code inside `(function() { ... })();`, we create an isolated lexical environment. Any variables or functions declared inside the IIFE do not pollute the global `window` object, preventing collision errors when combining multiple scripts.

To make the module useful, we construct an object containing references to the internal functions we want to expose, and return that object. This acts as our public API, while everything else remains securely private within the closure. Although ES6 modules are standard today, understanding the IIFE Module Pattern is crucial for maintaining legacy codebases and fully grasping how bundlers like Webpack traditionally encapsulated chunks."

## 3. Real-world Use Cases

- **Legacy Library Architecture:** Libraries like early versions of jQuery (`$`) were built using IIFEs to ensure they didn't overwrite variables in the user's codebase, exposing only a single global identifier.
- **Configuration Managers:** When initializing a web application, a `ConfigModule` can be used to securely fetch and store API URLs and environment settings. The configuration can only be read through getter methods, preventing accidental overrides during runtime.

## 4. Step-By-Step Process (Practice Mode)

To build the Theme & Layout Configurator:

1. **Create the Module:** Define a `ThemeManager` variable and assign an IIFE to it.
2. **Private State:** Inside the IIFE, create a configuration object that tracks the current `theme` (light/dark) and `layout` (grid/list).
3. **Public API:** Have the IIFE return an object with getters and setters (e.g., `setTheme`, `setLayout`).
4. **Implementation Logic:** The setters should not only update the private configuration object but also manipulate the DOM (e.g., changing the `className` of the body or preview area) to reflect the new state.
5. **Event Listeners:** Attach click handlers to the UI buttons that call the `ThemeManager`'s public API to trigger state changes.
