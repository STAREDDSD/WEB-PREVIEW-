const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const messageDiv = document.getElementById("message");
const copyUrlDiv = document.querySelector(".copy-url");
const generatedURL = document.getElementById("generatedURL");
const copyButton = document.getElementById("copyButton");

let fileMap = new Map(); // To store uploaded files

// Handle file selection
fileInput.addEventListener("change", () => {
  fileMap.clear();
  const files = fileInput.files;

  for (const file of files) {
    fileMap.set(file.name, file);
  }

  messageDiv.textContent = "Files selected successfully!";
  messageDiv.style.color = "blue";
});

// Handle file upload
uploadButton.addEventListener("click", () => {
  if (fileMap.size === 0) {
    messageDiv.textContent = "Please select files before uploading.";
    messageDiv.style.color = "red";
    return;
  }

  messageDiv.textContent = "Uploading files...";
  messageDiv.style.color = "orange";

  // Simulate file upload and preview generation
  setTimeout(() => {
    const htmlFile = Array.from(fileMap.values()).find(file => file.name.endsWith(".html"));
    if (!htmlFile) {
      messageDiv.textContent = "Error: Please upload at least one HTML file.";
      messageDiv.style.color = "red";
      return;
    }

    // Create Blob URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const blob = new Blob([event.target.result], { type: "text/html" });
      const previewURL = URL.createObjectURL(blob);

      // Display success message and preview link
      messageDiv.textContent = "Upload successful!";
      messageDiv.style.color = "green";

      copyUrlDiv.style.display = "block";
      generatedURL.value = previewURL;
    };
    reader.readAsText(htmlFile);
  }, 2000); // Simulate upload delay
});

// Handle copy URL
copyButton.addEventListener("click", () => {
  generatedURL.select();
  document.execCommand("copy");
  alert("URL copied to clipboard!");
});
