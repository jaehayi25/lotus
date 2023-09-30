// popup.js
document.addEventListener("DOMContentLoaded", function () {
    const storePageButton = document.getElementById("storePageButton");
    const pageList = document.getElementById("pageList");
    const pageUrlsList = document.getElementById("pageUrls");
  
    // Function to update the list of stored pages in the popup
    function updatePageList() {
      // Retrieve the stored pages from storage
      chrome.storage.local.get({ pages: [] }, function (result) {
        const pages = result.pages;
  
        // Clear the existing list
        pageUrlsList.innerHTML = '';
  
        // Function to add a site icon (favicon) next to a page URL
        function addFavicon(url, listItem) {
          const img = new Image();
          img.src = `https://www.google.com/s2/favicons?domain=${url}`;
          img.width = 16;
          img.height = 16;
          listItem.appendChild(img);
        }

        // Function to remove a URL from the list and storage
        function removePage(url) {
            const index = pages.indexOf(url);
            if (index > -1) {
            pages.splice(index, 1);
            // Update the stored pages
            chrome.storage.local.set({ pages: pages }, function () {
                console.log("Page removed successfully");
                // Update the displayed page list
                updatePageList();
            });
            }
        }
  
        // Add each stored page with its icon to the list
        pages.forEach(function (pageUrl) {
            const listItem = document.createElement("span");
            const urlText = document.createElement("span");
            const removeButton = document.createElement("button")
            urlText.textContent = pageUrl;
            
            // Add the site icon (favicon)
            addFavicon(pageUrl, listItem);

            removeButton.textContent = "x";
            removeButton.addEventListener("click", function () {
                removePage(pageUrl);
            });

            listItem.appendChild(urlText);
            listItem.appendChild(removeButton);
            pageUrlsList.appendChild(listItem);
        });
  
        // Show the list of stored pages if there are any, otherwise hide it
        if (pages.length > 0) {
          pageList.style.display = "block";
        } else {
          pageList.style.display = "none";
        }
      });
    }
  
    // Initial update of the page list when the popup opens
    updatePageList();
  
    // Click event handler for the "Store Current Page" button
    storePageButton.addEventListener("click", function () {
      // Get the current tab's URL
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentPageUrl = tabs[0].url;
        const domain = (new URL(currentPageUrl)).hostname.replace('www.','');
  
        // Retrieve existing pages from storage
        chrome.storage.local.get({ pages: [] }, function (result) {
          const pages = result.pages;
  
          // Add the current page domain to the array
          pages.push(domain);
  
          // Store the updated array back in storage
          chrome.storage.local.set({ pages: pages }, function () {
            console.log("Page stored successfully");
  
            // Update the displayed page list
            updatePageList();
          });
        });
      });
    });
  });
  