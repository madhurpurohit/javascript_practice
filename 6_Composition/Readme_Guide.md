# 11. Function Composition

## 1. Definition

**Function Composition** is a fundamental concept in functional programming where the output of one function is passed as the input to the next function. Instead of nesting function calls like `a(b(c(x)))`, composition allows developers to build a pipeline, commonly using a `compose` or `pipe` utility, making the data flow read cleanly from right-to-left or left-to-right.

## 2. Interview Explanation

_Imagine an interviewer asks: "What is function composition and how does it improve code quality?"_

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
