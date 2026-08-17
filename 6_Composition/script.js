const inputText = document.getElementById("input-text");
const btn = document.getElementById("btn-format");
const outputText = document.getElementById("output-text");

const trimText = (str) => str.trim();

const sanitizeText = (str) =>
  str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

const makeBoldText = (str) => str.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

const addNewLine = (str) => str.replace(/\n/g, "<br>");

// Create a custom 'compose()' function using Rest parameters (compose executes right-to-left).
const functionPipeline =
  // (...fns) collects all function arguments into an array.
  (...fns) =>
    // Return a new function that takes the initial input string
    (initialValue) =>
      // Use reduceRight to apply functions from right to left (last to first)
      fns.reduceRight(
        (currentResult, currentFunction) => currentFunction(currentResult),
        initialValue,
      );

// Build the pipeline!
const composeFunctions = functionPipeline(
  addNewLine,
  makeBoldText,
  sanitizeText,
  trimText,
);

btn.addEventListener("click", () => {
  const rawText = inputText.value;

  const resultText = composeFunctions(rawText);

  outputText.innerHTML = resultText;
});

// Note: Execution order is right-to-left.
// 1. trimText -> 2. sanitizeText -> 3. makeBold -> 4. addLineBreaks
