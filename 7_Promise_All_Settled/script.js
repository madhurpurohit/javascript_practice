const btnSeq = document.getElementById("btn-load-seq");
const btnAll = document.getElementById("btn-load-all");
const btnSettled = document.getElementById("btn-load-settled");
const timeLog = document.getElementById("time-log");

const cardStats = document.getElementById("card-stats");
const cardMatches = document.getElementById("card-matches");
const cardNotifs = document.getElementById("card-notifs");

// Reset UI helper
function resetUI() {
  [cardStats, cardMatches, cardNotifs].forEach((card) => {
    card.innerText = "Loading...";
    card.className = "card skeleton";
  });
  timeLog.innerText = "";
}

// Create 3 separate mock API promises
const fetchUserStats = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve("Stats Loaded (1s)"), 1000),
  );
const fetchRecentMatches = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve("Matches Loaded (2s)"), 2000),
  );
// Intentionally failing API
const fetchNotifications = () =>
  new Promise((_, reject) =>
    setTimeout(() => reject("Notifications API Down! (3s)"), 3000),
  );

// Implement Sequential 'await' (The Waterfall Anti-pattern)
btnSeq.addEventListener("click", async () => {
  resetUI();
  const start = performance.now();
  try {
    // Execution pauses at EACH await. Total time = 1s + 2s + 3s = 6 seconds.
    const stats = await fetchUserStats();
    cardStats.innerText = stats;
    cardStats.classList.remove("skeleton");

    const matches = await fetchRecentMatches();
    cardMatches.innerText = matches;
    cardMatches.classList.remove("skeleton");

    const notifs = await fetchNotifications(); // This will throw
    cardNotifs.innerText = notifs;
    cardNotifs.classList.remove("skeleton");
  } catch (err) {
    const end = performance.now();
    timeLog.innerText = `Waterfall Failed at: ${err} after ${((end - start) / 1000).toFixed(1)}s`;
  }
});

// Refactor using Promise.all (Fail-Fast)
btnAll.addEventListener("click", async () => {
  resetUI();
  const start = performance.now();
  try {
    // Fires all at once.
    // BUT, if ANY fail, the whole array fails immediately.
    const [stats, matches, notifs] = await Promise.all([
      fetchUserStats(),
      fetchRecentMatches(),
      fetchNotifications(),
    ]);

    // This code NEVER runs because fetchNotifications rejects
    cardStats.innerText = stats;
    cardStats.classList.remove("skeleton");
    cardMatches.innerText = matches;
    cardMatches.classList.remove("skeleton");
    cardNotifs.innerText = notifs;
    cardNotifs.classList.remove("skeleton");
  } catch (err) {
    const end = performance.now();
    timeLog.innerText = `Promise.all threw error: '${err}' after ${((end - start) / 1000).toFixed(1)}s`;
    // UI is left in a broken loading state for the successful APIs!
  }
});

// Refactor using Promise.allSettled (Resilient)
btnSettled.addEventListener("click", async () => {
  resetUI();
  const start = performance.now();

  // Fires all at once. Waits for all to finish, NEVER rejects.
  const results = await Promise.allSettled([
    fetchUserStats(),
    fetchRecentMatches(),
    fetchNotifications(),
  ]);

  const end = performance.now();
  timeLog.innerText = `Promise.allSettled completed in ${((end - start) / 1000).toFixed(1)}s`;

  // Results is an array of objects: { status: "fulfilled"|"rejected", value? , reason? }

  if (results[0].status === "fulfilled") {
    cardStats.innerText = results[0].value;
    cardStats.classList.remove("skeleton");
  }

  if (results[1].status === "fulfilled") {
    cardMatches.innerText = results[1].value;
    cardMatches.classList.remove("skeleton");
  }

  // Handle the failure gracefully without breaking the other widgets!
  if (results[2].status === "rejected") {
    cardNotifs.innerText = "Failed to load.";
    cardNotifs.style.color = "red";
    cardNotifs.classList.remove("skeleton");
  }
});
