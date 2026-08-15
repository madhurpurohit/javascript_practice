// TODO: Implement nested functions to manage directory state.
// - Create an outer function for the 'Root' level.
// - Inside it, create inner functions for 'src' and 'index.js'.
function rootDirectory() {
  // Toggle the visibility of the 'src' directory when the 'Root' folder is clicked, we can use an event listener on the 'Root' folder element. The inner function will handle the toggling of the 'hidden' class for the 'src' directory.
  let rootDir = document.querySelector(".level-1 > .folder-name");
  let srcParent = document.querySelector(".level-2");

  function toggleSrcVisibility() {
    srcParent.classList.toggle("hidden");
  }

  rootDir.addEventListener("click", toggleSrcVisibility);

  // Toggle the visibility of the 'index.js' file when the 'src' folder is clicked.
  let srcDir = document.querySelector(".level-2 > .folder-name");
  let indexParent = document.querySelector(".level-3");

  function toggleIndexVisibility() {
    indexParent.classList.toggle("hidden");
  }

  srcDir.addEventListener("click", toggleIndexVisibility);
}

rootDirectory();
