let code = document.getElementById("code-input");
let memoryPhaseOutput = document.getElementById("memory-output");
let executionPhaseOutput = document.getElementById("execution-output");
let startBtn = document.getElementById("start-btn");
let memoryBox = document.querySelector(".box.memory-phase");
let executionBox = document.querySelector(".box.execution-phase");

let isSimulating = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  // Parse lines for Memory Creation Phase
  codeLines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith("var")) {
      const parts = line.split(" ");
      const varName = parts[1] ? parts[1].replace(";", "").split("=")[0].trim() : "var";
      memoryOutput.push({ kind: "var", name: varName, status: '<span class="status-tag tag-undefined">undefined</span>' });
    } else if (line.startsWith("let") || line.startsWith("const")) {
      const kind = line.startsWith("let") ? "let" : "const";
      const parts = line.split(" ");
      const varName = parts[1] ? parts[1].replace(";", "").split("=")[0].trim() : kind;
      memoryOutput.push({ kind: kind, name: varName, status: '<span class="status-tag tag-tdz">uninitialized (TDZ)</span>' });
    } else if (line.startsWith("function")) {
      const parts = line.split(" ");
      const functionName = parts[1] ? parts[1].split("(")[0].trim() : "fn";
      memoryOutput.push({ kind: "fn", name: functionName, status: '<span class="status-tag tag-fn">ƒ() { ... }</span>' });
    }
  });

  // Parse lines for Execution Phase
  codeLines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith("var") || line.startsWith("let") || line.startsWith("const")) {
      const kind = line.startsWith("var") ? "var" : line.startsWith("let") ? "let" : "const";
      const parts = line.split(" ");
      const varName = parts[1] ? parts[1].replace(";", "").split("=")[0].trim() : "var";
      let val = "undefined";
      if (line.includes("=")) {
        val = line.split("=")[1].replace(";", "").trim();
      }
      executionOutput.push({ kind: kind, name: varName, status: `<span class="status-tag tag-value">${val}</span>` });
    } else if (line.startsWith("function")) {
      const parts = line.split(" ");
      const functionName = parts[1] ? parts[1].split("(")[0].trim() : "fn";
      executionOutput.push({ kind: "fn", name: functionName, status: '<span class="status-tag tag-fn">ƒ() { ... }</span>' });
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
      const rowElem = document.createElement("div");
      rowElem.className = "output-row active-step";
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


