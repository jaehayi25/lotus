// content.js

// Function to check if a URL is blocked
function isBlocked(url, blockedUrls) {
    return blockedUrls.some((blockedUrl) => {
        // You can implement custom matching logic here, e.g., exact match or domain match
        return url.includes(blockedUrl);
    });
}

// Function to inject custom HTML into the page
function injectCustomHtml(customHtml) {
    document.documentElement.innerHTML = customHtml;
}

// Retrieve the list of blocked URLs from storage
chrome.storage.local.get({ pages: [] }, function (result) {
    const blockedUrls = result.pages;

    // Check if the current page's URL is blocked
    if (isBlocked(window.location.href, blockedUrls)) {
        // Retrieve custom HTML from storage and inject it into the page
        chrome.storage.local.get({ customHtml: '' }, function (result) {
            const customHtml = result.customHtml;
            console.log('Retrieving custom html content');
            console.log(result.customHtml);
            if (customHtml) {
                injectCustomHtml(customHtml);
            }
        });
    }
});
