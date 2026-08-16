const logDiv = document.getElementById("log");

function logUI(msg) {
  logDiv.innerHTML += `<p>${msg}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight; // Auto-scroll
}

// 1. Build a curried function.
const trackEvent = (appName) => (eventType) => (elementId) => {
  const msg = `[${appName}] ${eventType} triggered on ${elementId}`;
  console.log(msg);

  document.querySelector(".empty-state").style.display = "none";

  logUI(msg);
};

const myAppTracker = trackEvent("E-Commerce Application");

// 2. Lock in specific Event Types based on the App Tracker
const trackClickEvent = myAppTracker("User_Click");
const trackPurchaseEvent = myAppTracker("User_Purchases");
const trackLoginEvent = myAppTracker("User_Login");

// 3. Final Execution attached to UI Elements
// We pass the final argument (elementId) when the button is clicked.
document.getElementById("btn-click").addEventListener("click", () => {
  trackClickEvent("track-btn-click"); // Executes the final inner function
});

document.getElementById("btn-purchase").addEventListener("click", () => {
  trackPurchaseEvent("purchase-btn-click");
});

document.getElementById("btn-login").addEventListener("click", () => {
  trackLoginEvent("login-btn-click");
});
