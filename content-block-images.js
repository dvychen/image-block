chrome.storage.sync.get("isBlocking", ({ isBlocking }) => {
    updateBlocks(isBlocking);
});

chrome.storage.sync.get("filters", ({ filters }) => {
    console.log(`Filters loaded: ${filters}`);
});

chrome.runtime.onMessage.addListener((msgObj, sender, sendResponse) => {
    if (msgObj.message === "isBlocking_value") {
        updateBlocks(msgObj.value);
    }
})

// updateBlocks blocks the filtered images if isBlocking, unblocks the filtered images otherwise.
function updateBlocks(isBlocking) {
    let allImgs = document.getElementsByTagName("img");
    if (!isBlocking) {
        for (let img of allImgs) {
            img.style.opacity = "1";
        }
    } else {
        for (let img of allImgs) {
            // TODO: Replace false with isFiltered where isFiltered is only true if 
            //   img has one of the filters as its labels. Must fetch from Google Vision API.
            if (false)
                img.style.opacity = "1"
            else 
                img.style.opacity = "0"
        }
    }
}
