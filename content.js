// content.js

// Function to check if a URL is blocked
function isBlocked(url, blockedUrls) {
    return blockedUrls.some((blockedUrl) => {
        // You can implement custom matching logic here, e.g., exact match or domain match
        return url.includes(blockedUrl);
    });
}

// Function to load custom HTML content from storage and display it in the textarea
function loadCustomHtml() {
    // Load the saved HTML content from chrome.storage.local
    chrome.storage.local.get({ customHtml: "" }, function (result) {
        const savedHtmlContent = result.customHtml;
        
        // Inject the saved HTML content into a specific element (e.g., with id "myDiv")
        document.getElementById("customHtml").innerHTML = savedHtmlContent;

        const textarea = document.getElementById("customHtml");
        textarea.focus(); 
        textarea.selectionStart = textarea.value.length; 
        setInterval(() => {
            textarea.style.caretColor = textarea.style.caretColor === "transparent" ? "white" : "transparent";
        }, 530);
    });  
}

// Function to save custom HTML content to storage
function saveCustomHtml() {
    const htmlContent = document.getElementById("customHtml").value;

    chrome.storage.local.set({ customHtml: htmlContent }, function () {
        console.log('Custom HTML saved successfully');
    });
}

var saveTimeout = 3000; 
var saveStatus; 
function handleInput() {
    // Clear the existing timeout (if any)
    clearTimeout(saveTimeout);

    if (saveStatus) saveStatus.textContent = "Saving..."; 

    // Set a new timeout to trigger saveContent after 3 seconds of idle time
    saveTimeout = setTimeout(function () {
        saveCustomHtml();
        if (saveStatus) saveStatus.textContent = "Saved.";
      }, 3000); // Adjust the delay as needed (3 seconds in this example)
}

function loadBlockedPage() {
    newHTML = `<!DOCTYPE html>
    <html>
    <head>
      <title>Lotus - Site Blocker</title>
      <style>
        /* Center all elements in the body */
        body {
          background: linear-gradient(to bottom, #95a6b2, #038ee2);
          margin: 0; /* Remove default margin to fully occupy the viewport */
          padding: 0; /* Remove default padding */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          height: 100vh; /* Center vertically on the viewport */
          color: white;
        }
    
        /* Style for the header */
        h1 {
          font-size: 24px;
        }
    
        /* Style for the textarea and button */
        #customHtml,
        #saveButton {
          margin-top: 10px;
        }

        #customHtml {
            background-color: transparent;
            color: white;
            border: none;
            outline: none;
            font-size: 18px; 
        }
      </style>
      <script src="content.js"></script>
    </head>
    <body>
      <img src="chrome-extension://fnjopognibfjmgdbloencjjiccggoaob/images/logo.png" alt="lotus logo" width="200" height="200">
      <h1>Lotus</h1>
      <textarea id="customHtml" rows="10" cols="50"></textarea><br>
      <button id="saveButton">Save</button>
      <p id="saveStatus">Type to edit</p>
    </body>
    </html>`

    document.open()
    document.write(newHTML)
    document.close()

    const button = document.getElementById("saveButton"); 
    button.addEventListener("click", saveCustomHtml);

    const textarea = document.getElementById("customHtml");
    // Attach input event listener to the textarea to detect user input
    textarea.addEventListener("input", handleInput);

    saveStatus = document.getElementById("saveStatus");
}

// Retrieve the list of blocked URLs from storage
chrome.storage.local.get({ pages: [] }, function (result) {
    const blockedUrls = result.pages;

    // Check if the current page's URL is blocked
    if (isBlocked(window.location.href, blockedUrls)) {
        // Retrieve custom HTML from storage and inject it into the page
        loadBlockedPage(); 
        loadCustomHtml(); 
    }
});
