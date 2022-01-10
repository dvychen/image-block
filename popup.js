chrome.storage.sync.get("filters", ({ filters }) => {
    console.log(`Filters loaded: ${filters}`);
});

let toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let {isBlocking} = await chrome.storage.sync.get("isBlocking");
    await chrome.storage.sync.set({ isBlocking: !isBlocking });

    await chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: setPageBackgroundColor
    }); 

});

// Temporary
function setPageBackgroundColor() {
    chrome.storage.sync.get("isBlocking", ({ isBlocking }) => {
        if (isBlocking) 
            document.body.style.backgroundColor = 'green';
        else 
            document.body.style.backgroundColor = 'red';
    });
}

// Method for blocking images:
// Step 1: Add the appropriate ImageBlock<insert-label-here> CSS classes to each img
// Step 2: if isBlocking, then set opacity of each class to 0 / block the classes
// Step 3: if !isBlocking, then set opacity of each claass to 1 / unblock the classes

function labelImages(filters) {

}

function blockImages(filters) {
    
}

function unblockImages(filters) {

}
