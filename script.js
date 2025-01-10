// Handle file selection and preview generation
document.getElementById("uploadForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Please select at least one file to preview.");
        return;
    }

    // Check for HTML, CSS, and JS files in the selection
    let htmlFile = null;
    let cssFiles = [];
    let jsFiles = [];

    for (let i = 0; i < files.length; i++) {
        if (files[i].name.endsWith(".html")) {
            htmlFile = files[i];
        } else if (files[i].name.endsWith(".css")) {
            cssFiles.push(files[i]);
        } else if (files[i].name.endsWith(".js")) {
            jsFiles.push(files[i]);
        }
    }

    if (!htmlFile) {
        alert("Please select at least one HTML file to preview.");
        return;
    }

    // Read the HTML file and generate a preview
    const reader = new FileReader();
    reader.onload = function (event) {
        const htmlContent = event.target.result;
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "500px";
        iframe.id = "previewIframe";

        // Inject the HTML content into the iframe
        document.body.appendChild(iframe);
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Inject CSS files
        cssFiles.forEach((cssFile) => {
            const cssReader = new FileReader();
            cssReader.onload = function (cssEvent) {
                const style = iframeDoc.createElement("style");
                style.innerHTML = cssEvent.target.result;
                iframeDoc.head.appendChild(style);
            };
            cssReader.readAsText(cssFile);
        });

        // Inject JS files
        jsFiles.forEach((jsFile) => {
            const jsReader = new FileReader();
            jsReader.onload = function (jsEvent) {
                const script = iframeDoc.createElement("script");
                script.innerHTML = jsEvent.target.result;
                iframeDoc.body.appendChild(script);
            };
            jsReader.readAsText(jsFile);
        });
    };

    reader.readAsText(htmlFile); // Start reading the HTML file
});
