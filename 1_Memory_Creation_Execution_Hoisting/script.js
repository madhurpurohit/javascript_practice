let code = document.getElementById("code-input");
let memoryPhaseOutput = document.getElementById("memory-output");
let executionPhaseOutput = document.getElementById("execution-output");
let startBtn = document.getElementById("start-btn");
let memoryBox = document.querySelector(".box.memory-phase");
let executionBox = document.querySelector(".box.execution-phase");

let isSimulating = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to escape HTML special characters
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function simulateMemoryPhase() {
  if (isSimulating) return;
  isSimulating = true;

  // Disable button and show active status
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.innerHTML = `<span class="spinner"></span> Phase 1: Memory...`;
  }

  // Clear previous outputs
  memoryPhaseOutput.innerHTML = "";
  executionPhaseOutput.innerHTML = "";
  if (memoryBox) memoryBox.classList.remove("active-phase");
  if (executionBox) executionBox.classList.remove("active-phase");

  const codeLines = code.value.split("\n");
  let memoryOutput = [];
  let executionOutput = [];
  let varTypes = {}; // To remember whether a variable was var, let, or const

  // Parse lines for Memory Creation Phase (Hoisting)
  codeLines.forEach((line) => {
    let cleanLine = line.trim();
    // Remove inline or line comments
    if (cleanLine.includes("//")) cleanLine = cleanLine.split("//")[0].trim();
    if (!cleanLine || cleanLine.startsWith("/*") || cleanLine.startsWith("*")) return;

    if (cleanLine.startsWith("var ") || cleanLine.startsWith("var\t") || /^var(\s+|=)/.test(cleanLine)) {
      const afterKeyword = cleanLine.replace(/^var\s*/, "");
      const varName = afterKeyword.split("=")[0].replace(/;.*$/, "").trim();
      if (varName && !memoryOutput.some((item) => item.name === varName)) {
        varTypes[varName] = "var";
        memoryOutput.push({
          kind: "var",
          name: varName,
          status: '<span class="status-tag tag-undefined">undefined</span>',
        });
      }
    } else if (
      cleanLine.startsWith("let ") ||
      cleanLine.startsWith("let\t") ||
      /^let(\s+|=)/.test(cleanLine) ||
      cleanLine.startsWith("const ") ||
      cleanLine.startsWith("const\t") ||
      /^const(\s+|=)/.test(cleanLine)
    ) {
      const isLet = cleanLine.startsWith("let");
      const kind = isLet ? "let" : "const";
      const afterKeyword = cleanLine.replace(/^(let|const)\s*/, "");
      const varName = afterKeyword.split("=")[0].replace(/;.*$/, "").trim();
      if (varName && !memoryOutput.some((item) => item.name === varName)) {
        varTypes[varName] = kind;
        memoryOutput.push({
          kind: kind,
          name: varName,
          status: '<span class="status-tag tag-tdz">uninitialized (TDZ)</span>',
        });
      }
    } else if (
      cleanLine.startsWith("function ") ||
      cleanLine.startsWith("function\t") ||
      /^function(\s+|\()/.test(cleanLine)
    ) {
      const afterKeyword = cleanLine.replace(/^function\s*/, "");
      const functionName = afterKeyword.split("(")[0].trim() || "fn";
      if (functionName && !memoryOutput.some((item) => item.name === functionName)) {
        varTypes[functionName] = "fn";
        memoryOutput.push({
          kind: "fn",
          name: functionName,
          status: '<span class="status-tag tag-fn">ƒ() { ... }</span>',
        });
      }
    }
  });

  // Parse lines for Execution Phase
  codeLines.forEach((line) => {
    let cleanLine = line.trim();
    // Remove inline or line comments
    if (cleanLine.includes("//")) cleanLine = cleanLine.split("//")[0].trim();
    if (!cleanLine || cleanLine.startsWith("/*") || cleanLine.startsWith("*")) return;

    // 1. Declarations (var, let, const)
    if (/^(var|let|const)(\s+|=)/.test(cleanLine)) {
      const isVar = cleanLine.startsWith("var");
      const isLet = cleanLine.startsWith("let");
      const kind = isVar ? "var" : isLet ? "let" : "const";
      const afterKeyword = cleanLine.replace(/^(var|let|const)\s*/, "");
      const varName = afterKeyword.split("=")[0].replace(/;.*$/, "").trim();

      if (cleanLine.includes("=")) {
        const eqIndex = cleanLine.indexOf("=");
        const rawVal = cleanLine.slice(eqIndex + 1).replace(/;+$/, "").trim();
        let displayVal = escapeHtml(rawVal);
        let tagClass = "tag-value";
        if (rawVal.startsWith("function") || rawVal.includes("=>")) {
          displayVal = "ƒ() { ... }";
          tagClass = "tag-fn";
        }
        executionOutput.push({
          kind: kind,
          name: varName,
          status: `<span class="status-tag ${tagClass}">${displayVal}</span>`,
        });
      } else {
        // Variable declared without assignment (e.g. let name; or var a;)
        executionOutput.push({
          kind: kind,
          name: varName,
          status: '<span class="status-tag tag-undefined">undefined</span>',
        });
      }
    }
    // 2. Function declaration
    else if (/^function(\s+|\()/.test(cleanLine)) {
      const afterKeyword = cleanLine.replace(/^function\s*/, "");
      const functionName = afterKeyword.split("(")[0].trim() || "fn";
      executionOutput.push({
        kind: "fn",
        name: functionName,
        status: '<span class="status-tag tag-fn">ƒ() { ... }</span>',
      });
    }
    // 3. Direct assignment or late initialization (e.g. name = "Madhur"; or name="Madhur"; or a = 50;)
    else if (
      cleanLine.includes("=") &&
      !cleanLine.includes("==") &&
      !cleanLine.includes("===") &&
      !cleanLine.includes("!=") &&
      !cleanLine.includes("<=") &&
      !cleanLine.includes(">=")
    ) {
      const eqIndex = cleanLine.indexOf("=");
      const leftPart = cleanLine.slice(0, eqIndex).replace(/[+\-*/]/g, "").trim();
      const rawVal = cleanLine.slice(eqIndex + 1).replace(/;+$/, "").trim();

      // Check if leftPart is a valid variable identifier
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(leftPart)) {
        const varName = leftPart;
        const kind = varTypes[varName] || "let";
        let displayVal = escapeHtml(rawVal);
        let tagClass = "tag-value";
        if (rawVal.startsWith("function") || rawVal.includes("=>")) {
          displayVal = "ƒ() { ... }";
          tagClass = "tag-fn";
        }
        executionOutput.push({
          kind: kind,
          name: varName,
          status: `<span class="status-tag ${tagClass}">${displayVal}</span>`,
        });
      }
    }
  });

  // STEP 1: Animate Memory Creation Phase (Hoisting)
  if (memoryBox) memoryBox.classList.add("active-phase");
  if (memoryOutput.length === 0) {
    memoryPhaseOutput.innerHTML = '<div class="empty-state">No variable or function declarations detected.</div>';
    await delay(500);
  } else {
    for (let i = 0; i < memoryOutput.length; i++) {
      const item = memoryOutput[i];
      const rowElem = document.createElement("div");
      rowElem.className = "output-row active-step";
      rowElem.setAttribute("data-var", item.name);
      rowElem.innerHTML = `
        <div class="var-info">
          <span class="kind-badge kind-${item.kind}">${item.kind}</span>
          <span class="var-name">${item.name}</span>
        </div>
        ${item.status}
      `;
      memoryPhaseOutput.appendChild(rowElem);
      await delay(600);
      rowElem.classList.remove("active-step");
    }
  }
  if (memoryBox) memoryBox.classList.remove("active-phase");

  // Pause between Phase 1 and Phase 2
  await delay(800);

  // STEP 2: Animate Execution Phase (Evaluation)
  if (startBtn) {
    startBtn.innerHTML = `<span class="spinner"></span> Phase 2: Execution...`;
  }
  if (executionBox) executionBox.classList.add("active-phase");

  if (executionOutput.length === 0) {
    executionPhaseOutput.innerHTML = '<div class="empty-state">No execution statements detected.</div>';
    await delay(500);
  } else {
    for (let i = 0; i < executionOutput.length; i++) {
      const item = executionOutput[i];

      // Check if this variable row already exists in execution phase output
      let existingRow = executionPhaseOutput.querySelector(`[data-var="${item.name}"]`);

      if (existingRow) {
        // Variable updated / initialized later (e.g. name = "Madhur";)
        existingRow.classList.add("active-step");
        const statusElem = existingRow.querySelector(".status-tag");
        if (statusElem) {
          statusElem.outerHTML = item.status;
        } else {
          existingRow.insertAdjacentHTML("beforeend", item.status);
        }
        await delay(600);
        existingRow.classList.remove("active-step");
      } else {
        // First time entering execution phase
        const rowElem = document.createElement("div");
        rowElem.className = "output-row active-step";
        rowElem.setAttribute("data-var", item.name);
        rowElem.innerHTML = `
          <div class="var-info">
            <span class="kind-badge kind-${item.kind}">${item.kind}</span>
            <span class="var-name">${item.name}</span>
          </div>
          ${item.status}
        `;
        executionPhaseOutput.appendChild(rowElem);
        await delay(600);
        rowElem.classList.remove("active-step");
      }
    }
  }
  if (executionBox) executionBox.classList.remove("active-phase");

  // Re-enable button
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      Re-run Simulation
    `;
  }
  isSimulating = false;
}

if (startBtn) {
  startBtn.addEventListener("click", simulateMemoryPhase);
}

document.body.addEventListener("keydown", (e) => {
  if (e.key === "F3") {
    e.preventDefault();
    simulateMemoryPhase();
  }
});


