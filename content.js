// content.js

// Function to check if a URL is blocked
function isBlocked(url, blockedUrls) {
    return blockedUrls.some((blockedUrl) => {
      // You can implement custom matching logic here, e.g., exact match or domain match
      return url.includes(blockedUrl);
    });
}

// Retrieve the list of blocked URLs from storage
chrome.storage.local.get({ pages: [] }, function (result) {
    const blockedUrls = result.pages;

    // Check if the current page's URL is blocked
    if (isBlocked(window.location.href, blockedUrls)) {
        // Apply custom CSS to hide the blocked site
        const style = document.createElement("style");
        style.textContent = `
        /* Add your custom CSS to hide the blocked site */
        body {
            display: none !important;
        }
        `;
        document.head.appendChild(style);
    }
});
