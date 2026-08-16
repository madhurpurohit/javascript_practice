// Without Module Pattern.
// const btnLight = document.getElementById("btn-light");
// const btnDark = document.getElementById("btn-dark");
// const btnGrid = document.getElementById("btn-grid");
// const btnList = document.getElementById("btn-list");

// let config = {
//   theme: "light",
//   layout: "grid",
// };

// const setTheme = (selectedTheme) => {
//   if (!selectedTheme) {
//     config.theme = "light";
//   }
//   config.theme = selectedTheme;

//   localStorage.setItem("theme", config.theme);
//   document.body.classList.add(config.theme);
//   document.body.classList.remove(selectedTheme === "dark" ? "light" : "dark");
// };

// const getTheme = () => {
//   let localTheme = localStorage.getItem("theme");

//   setTheme(localTheme ?? config.theme);
// };

// btnDark.addEventListener("click", () => setTheme("dark"));
// btnLight.addEventListener("click", () => setTheme("light"));

// const setLayout = (selectedLayout) => {
//   let previewCards = document.querySelector(".preview");
//   if (!selectedLayout) {
//     config.layout = "grid";
//   }

//   config.layout = selectedLayout;

//   localStorage.setItem("layout", config.layout);
//   previewCards.classList.add(config.layout);
//   previewCards.classList.remove(selectedLayout === "list" ? "grid" : "list");
// };

// const getLayout = () => {
//   let localLayout = localStorage.getItem("layout");

//   setLayout(localLayout ?? config.layout);
// };

// btnGrid.addEventListener("click", () => setLayout("grid"));
// btnList.addEventListener("click", () => setLayout("list"));

// (function () {
//   getTheme();
//   getLayout();
// })();

// With Module Pattern.
// TODO: Task 1 - Use the Module Pattern (via IIFE) to create a 'ThemeManager'.
const ThemeManager = (function () {
  // Get user settings
  let userTheme = localStorage.getItem("theme");
  let userLayout = localStorage.getItem("layout");

  // Private configuration state
  // These variables are protected from global namespace pollution
  const config = {
    theme: userTheme ?? "light",
    layout: userLayout ?? "grid",
  };

  // Private helper function (cannot be called directly from outside)
  function updateDOM() {
    // Update theme
    if (config.theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }

    // Update layout
    const previewArea = document.getElementById("preview-area");
    previewArea.className = "preview"; // Reset
    previewArea.classList.add(config.layout);
  }
  updateDOM();

  // TODO: Task 2 - Expose public methods
  return {
    // Public method to get current theme
    getTheme: function () {
      return config.theme;
    },

    // Public method to mutate theme and update UI
    setTheme: function (newTheme) {
      if (newTheme === "light" || newTheme === "dark") {
        config.theme = newTheme;
        localStorage.setItem("theme", newTheme);
        updateDOM();
      }
    },

    // Public method to get current layout
    getLayout: function () {
      return config.layout;
    },

    // Public method to mutate layout and update UI
    setLayout: function (newLayout) {
      if (newLayout === "grid" || newLayout === "list") {
        config.layout = newLayout;
        localStorage.setItem("layout", newLayout);
        updateDOM();
      }
    },
  };
})();

document.getElementById("btn-light").addEventListener("click", () => {
  ThemeManager.setTheme("light");
});

document.getElementById("btn-dark").addEventListener("click", () => {
  ThemeManager.setTheme("dark");
});

document.getElementById("btn-grid").addEventListener("click", () => {
  ThemeManager.setLayout("grid");
});

document.getElementById("btn-list").addEventListener("click", () => {
  ThemeManager.setLayout("list");
});
