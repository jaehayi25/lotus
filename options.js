// options.js

// Function to load custom HTML content from storage and display it in the textarea
function loadCustomHtml() {
    chrome.storage.local.get({ customHtml: '' }, function (result) {
        document.documentElement.innerHTML = result.customHtml;
    });
}
    
// Function to save custom HTML content to storage
function saveCustomHtml() {
    const customHtml = document.documentElement.innerHTML;
    chrome.storage.local.set({ customHtml: customHtml }, function () {
        console.log('Custom HTML saved successfully');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadCustomHtml();
    
    // Add a click event listener to the "Save" button
    document.getElementById('saveButton').addEventListener('click', function () {
        saveCustomHtml();
    });
});
  