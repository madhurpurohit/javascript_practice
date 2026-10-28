const fileInput = document.getElementById("file-input");
const previewBox = document.getElementById("preview-box");

// TODO: Task 1 - Wrap the old callback-based FileReader API into a modern Promise.
// This is manual Promisification.
function uploadImageAsync(file) {
  return new Promise((resolve, reject) => {
    // Instantiate the legacy API
    const reader = new FileReader();

    // Map the legacy success event to Promise resolve
    reader.onload = function (event) {
      // The Base64 string of the image is in event.target.result
      resolve(event.target.result);
    };

    // Map the legacy error event to Promise reject
    reader.onerror = function (error) {
      reject("File reading failed: ", error);
    };

    // Trigger the legacy API process
    reader.readAsDataURL(file);
  });
}

// TODO: Task 2 - Use await manually in the main logic.
// Now we can consume the legacy API using modern syntax!
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  previewBox.innerHTML = "<span>Processing...</span>";

  try {
    // Look how clean this is compared to nesting callbacks!
    // The execution pauses here until the FileReader finishes and resolves.
    const base64ImageString = await uploadImageAsync(file);

    // Update DOM
    previewBox.innerHTML = `<img src="${base64ImageString}" alt="Preview">`;
  } catch (error) {
    // Standard try/catch handles the Promise rejection cleanly
    previewBox.innerHTML = `<span style="color:red">${error}</span>`;
    console.error(error);
  }
});
