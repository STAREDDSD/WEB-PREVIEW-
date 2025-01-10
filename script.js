// Run code from textarea
document.getElementById('runCodeBtn').addEventListener('click', () => {
  const code = document.getElementById('codeInput').value;
  const previewFrame = document.getElementById('previewFrame');
  const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
  previewDocument.open();
  previewDocument.write(code);
  previewDocument.close();
});

// Upload and preview files
document.getElementById('uploadBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('fileUpload');
  const files = fileInput.files;
  
  if (files.length === 0) {
    alert('Please upload at least one file.');
    return;
  }

  // Objects to hold file content
  let htmlContent = '';
  let cssContent = '';
  let jsContent = '';

  const promises = [];

  // Process each file
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = function (e) {
        if (file.type === 'text/html') {
          htmlContent = e.target.result;
        } else if (file.type === 'text/css') {
          cssContent += `<style>${e.target.result}</style>`;
        } else if (file.type === 'application/javascript') {
          jsContent += `<script>${e.target.result}</script>`;
        }
        resolve();
      };
      reader.onerror = reject;
    });

    promises.push(promise);
    reader.readAsText(file);
  });

  // Combine and display content after all files are read
  Promise.all(promises).then(() => {
    const previewFrame = document.getElementById('previewFrame');
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        ${cssContent}
      </head>
      <body>
        ${htmlContent}
        ${jsContent}
      </body>
      </html>
    `);
    previewDocument.close();
  }).catch(err => alert('Error processing files: ' + err.message));
});

// Drag-and-drop functionality
const dropArea = document.getElementById('dropArea');
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('dragover');

  const files = e.dataTransfer.files;
  document.getElementById('fileUpload').files = files; // Add files to input
  document.getElementById('uploadBtn').click(); // Trigger upload
});