# 14. Promisification

## 1. Definition

**Promisification** is the process of converting a function that accepts a traditional callback (error-first callback pattern) into a function that returns a Promise. This allows older, legacy APIs or callback-based libraries to be consumed using modern `async/await` syntax, drastically improving code readability and error handling.

## 2. Interview Explanation

_Imagine an interviewer asks: "How do you handle older legacy libraries that only support callbacks in a modern async/await codebase?"_

**Expert Response:**
"We definitely don't want to mix callback hell with `async/await` in the same codebase. The solution is Promisification. I would create a wrapper function that returns a `new Promise()`. Inside the executor function of that Promise, I invoke the legacy callback-based API.

When the legacy API triggers its success callback, I map it to the Promise's `resolve()` method. If it triggers its error callback, I map it to the Promise's `reject()` method. Once wrapped, the entire application can interface with this legacy code using clean `await` statements and standard `try/catch` blocks for error handling, entirely abstracting the old callback behavior away."

## 3. Real-world Use Cases

- **Node.js `fs` module:** Before `fs.promises` existed, developers used `util.promisify` to convert functions like `fs.readFile` so they didn't have to use nested callbacks to read sequential files.
- **Browser APIs:** Certain older browser APIs, like the `FileReader` API (used for reading uploaded files into Base64 strings) or `Geolocation.getCurrentPosition()`, natively use event listeners or callbacks. Promisifying them makes them much easier to integrate into modern React/Vue component logic.

## 4. Step-By-Step Process (Practice Mode)

To build the Image Upload & Previewer:

1. **Understand the Legacy API:** The native `FileReader` object requires you to set `.onload` and `.onerror` callback properties, and then call `.readAsDataURL(file)`. It does not return a Promise.
2. **Promisify It:** Create a function `uploadImage(file)`. Inside it, return `new Promise((resolve, reject) => { ... })`.
3. **Map Callbacks:** Inside the Promise, instantiate `new FileReader()`. Inside its `onload` callback, call `resolve(reader.result)`. Inside `onerror`, call `reject(error)`. Finally, trigger it with `readAsDataURL`.
4. **Consume Modernly:** Attach an event listener to the file input. Make the handler `async`. Grab the file, use `try { const result = await uploadImage(file); } catch { ... }`, and update the UI with the resulting Base64 string.
