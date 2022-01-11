let toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", async () => {
    // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let {isBlocking} = await chrome.storage.sync.get("isBlocking");
    isBlocking = !isBlocking;
    await chrome.storage.sync.set({ isBlocking: isBlocking });

    let allTabs = await chrome.tabs.query({});
    for (let tab of allTabs) {
        chrome.tabs.sendMessage(tab.id, {
            message: "isBlocking_value",
            value: isBlocking
        },
        () => {
            console.log("message was sent:");
            console.log({
                message: "isBlocking_value",
                value: isBlocking
            });
        });
    }

    // await chrome.scripting.executeScript({
    //     target: {tabId: tab.id},
    //     function: setPageBackgroundColor
    // }); 

});

// Temporary
// function setPageBackgroundColor() {
//     chrome.storage.sync.get("isBlocking", ({ isBlocking }) => {
//         if (isBlocking) 
//             document.body.style.backgroundColor = 'green';
//         else 
//             document.body.style.backgroundColor = 'red';
//     });
// }

// Method for blocking images:
// Step 1: Block all images (done using block-img.css)
// Step 2: If !isBlocking, unblock all images
// Step 3: Otherwise, iterate images checking if matches filters --> if no match, then set opacity 1.

function labelImages(filters) {
    
}

function blockImages(filters) {
    
}

function unblockImages(filters) {

}
