// background.js

// Initialize customHtml in chrome.storage.local
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get({ customHtml: '' }, function (result) {
        // Check if customHtml is already set; if not, initialize it with the default content
        if (!result.customHtml) {
            const defaultHtmlUrl = chrome.runtime.getURL('options.html');
    
            // Fetch the content of the local HTML file
            fetch(defaultHtmlUrl)
                .then(response => response.text())
                .then(defaultHtmlContent => {
                    chrome.storage.local.set({ customHtml: defaultHtmlContent });
                })
                .catch(error => {
                    console.error('Error loading default HTML:', error);
                });
        }
    });
});