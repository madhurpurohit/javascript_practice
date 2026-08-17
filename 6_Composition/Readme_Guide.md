# 11. Function Composition

## 1. Definition
**Function Composition** is a fundamental concept in functional programming where the output of one function is passed as the input to the next function. Instead of nesting function calls like `a(b(c(x)))`, composition allows developers to build a pipeline, commonly using a `compose` or `pipe` utility, making the data flow read cleanly from right-to-left or left-to-right.

## 2. Interview Explanation
*Imagine an interviewer asks: "What is function composition and how does it improve code quality?"*

**Expert Response:**
"Function composition is about building complex logic by assembling small, single-responsibility functions. When you have a data transformation pipeline—say, fetching a string, trimming it, capitalizing it, and wrapping it in HTML—writing imperative code makes it difficult to test and maintain. 

By creating pure, unary (single-argument) functions for each of those small steps, I can use a `compose` function (often built using `Array.prototype.reduceRight`) to chain them together. The data flows sequentially through the pipeline. This makes the code declarative. It's much easier to unit test a simple `trim()` function than a massive monolithic function that does five different transformations. Libraries like Redux utilize composition heavily (e.g., `applyMiddleware`) to chain logic."

## 3. Real-world Use Cases
- **Data Parsing/Formatting Pipelines:** Processing raw CSV data into a usable JSON format often requires multiple steps: split by newline, filter empty rows, map to objects, and validate schema. Composition creates a clean pipeline for this.
- **Redux Middleware:** In state management, dispatching an action often needs to pass through multiple middleware layers (logging, async thunks, error handling) before reaching the reducer. This is achieved via composition.

## 4. Step-By-Step Process (Practice Mode)
To build the Markdown Content Formatter:
1. **Define Unary Functions:** Write three small, pure functions that take a string and return a string:
   - One to trim whitespace.
   - One to wrap text in `<b>` tags.
   - One to remove specific characters (e.g., stripping out `<script>` tags for basic sanitization).
2. **Build the Compose Utility:** Create a higher-order function called `compose`. It should accept an array of functions as arguments. It returns a new function that takes an initial input value.
3. **Use ReduceRight:** Inside `compose`, use `reduceRight` to pass the result of the current function as the argument to the next function in the array.
4. **Wire the UI:** When the "Format Output" button is clicked, read the textarea, run it through your composed pipeline function, and inject the final result into the output `div`.

## 5. Code Solution (Reference)

```javascript
const inputText = document.getElementById('input-text');
const btnFormat = document.getElementById('btn-format');
const outputText = document.getElementById('output-text');

// TODO: Task 1 - Write simple, single-purpose functions (Pure Functions)

// Function 1: Trim whitespace
const trimText = (str) => str.trim();

// Function 2: Strip script tags (basic sanitization)
const sanitizeText = (str) => str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

// Function 3: Convert markdown-like bold (**text**) to HTML <b>text</b>
const makeBold = (str) => {
    // Replace **something** with <b>something</b>
    return str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
};

// Function 4: Convert newlines to <br> tags for HTML rendering
const addLineBreaks = (str) => str.replace(/\n/g, '<br>');

// TODO: Task 2 - Create a custom 'compose()' function using Rest parameters
// compose executes right-to-left. 
// (...fns) collects all function arguments into an array.
const compose = (...fns) => {
    // Return a new function that takes the initial input string
    return (initialValue) => {
        // Use reduceRight to apply functions from right to left
        return fns.reduceRight((currentResult, currentFunction) => {
            return currentFunction(currentResult);
        }, initialValue);
    };
};

// Build the pipeline! 
// Note: Execution order is right-to-left. 
// 1. trimText -> 2. sanitizeText -> 3. makeBold -> 4. addLineBreaks
const formatPipeline = compose(
    addLineBreaks, 
    makeBold,      
    sanitizeText,  
    trimText       
);

// Alternative: 'pipe' executes left-to-right (using standard .reduce)
// const pipe = (...fns) => (x) => fns.reduce((res, fn) => fn(res), x);

// Wire it to the UI
btnFormat.addEventListener('click', () => {
    const rawData = inputText.value;
    
    // Pass raw data through the composed pipeline
    const formattedData = formatPipeline(rawData);
    
    // Render result
    outputText.innerHTML = formattedData;
});
```
