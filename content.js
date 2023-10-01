// Function to check if a URL is blocked
function isBlocked(url, blockedUrls) {
    return blockedUrls.some((blockedUrl) => {
        return url.includes(blockedUrl);
    });
}

// Function to load custom HTML content from storage and display it in the textarea
function loadCustomHtml() {
    // Load the saved HTML content from chrome.storage.local
    chrome.storage.local.get({ customHtml: "" }, function (result) {
        const savedHtmlContent = result.customHtml;
        
        // Inject the saved HTML content into a specific element 
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

var saveTimeout; 
var saveStatus; 
function handleInput() {
    // Clear the existing timeout (if any)
    clearTimeout(saveTimeout);

    if (saveStatus) saveStatus.textContent = "Saving..."; 

    // Set a new timeout to trigger saveContent after 3 seconds of idle time
    saveTimeout = setTimeout(function () {
        saveCustomHtml();
        if (saveStatus) saveStatus.textContent = "Saved.";
      }, 3000); 
}

function loadBlockedPage() {
    newHTML = `<!DOCTYPE html>
    <html>
    <head>
      <title>lotus</title>
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
          margin: 0; 
          padding: 0; 
          font-family: Garamond, serif;
        }

        h4 {
            font-size: 16px; 
            margin-top: 6px; 
            padding: 0;
            color: #DCDCDC;  
            font-family: Verdana, sans-serif;
        }

        .header-container {
            display: flex; /* Use Flexbox for horizontal layout */
            flex-direction: column; /* Stack h1 and h4 vertically */
            align-items: center; /* Center horizontally */
            margin-bottom: 10px; /* Add spacing between header and textarea */
        }
        
        #customHtml {
            margin-top: 10px;
            background-color: transparent;
            color: white;
            border: none;
            outline: none;
            font-size: 18px; 
            font-family: Verdana, sans-serif;
        }

        #saveStatus {
            font-size: 16px; 
            font-family: Verdana, sans-serif;
        }

        #createdBy {
            position: absolute; 
            bottom: 40px; 
            left: 0; 
            right: 0; 
            text-align: center; 
            font-size: 14px; 
            color: #DCDCDC; 
            font-family: Verdana, sans-serif;
        }

        #createdBy p {
            margin: 6px; 
            padding: 0; 
        }

        #authorLink {
            color: #DCDCDC;
            text-decoration: underline; 
            cursor: pointer; 
        }
      </style>
      <script src="content.js"></script>
    </head>
    <body>
      <img src="chrome-extension://igpmijcgjjaijipedegongbgbldhacje/images/logo.png" alt="lotus logo" width="200" height="200">
      <div class="header-container">
        <h1>lotus</h1>
        <h4>a site blocker to help you focus.</h4>
      </div>
      <textarea id="customHtml" rows="10" cols="50"></textarea><br>
      <p id="saveStatus">Type a message for yourself.</p>
      <div id="createdBy">
        <p>Made by <a id="authorLink" href="https://jaehayi.com">Jaeha Yi</a> in 2023</p>
        <p><a id="authorLink" href="https://jaehayi.com">github repo</a></p>
      </div>
    </body>
    </html>`

    document.open()
    document.write(newHTML)
    document.close()

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
