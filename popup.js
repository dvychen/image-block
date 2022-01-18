let toggleButton = document.getElementById("toggleButton");

chrome.storage.sync.get("isBlocking", ({ isBlocking }) => {
    updateToggleColour(isBlocking, toggleButton);
});

chrome.storage.sync.get("apiKey", ({ apiKey }) => {
    document.getElementById("apiKeyInput").value = apiKey ? apiKey : "";
});

chrome.storage.sync.get("filters", ({ filters }) => {
    document.getElementById("filtersInput").value = filters.length ? filters : "";
});

toggleButton.addEventListener("click", async () => {
    let {isBlocking} = await chrome.storage.sync.get("isBlocking");
    isBlocking = !isBlocking;
    await chrome.storage.sync.set({ isBlocking: isBlocking });
    updateToggleColour(isBlocking, toggleButton);

    let allTabs = await chrome.tabs.query({});
    for (let tab of allTabs) {
        await chrome.tabs.sendMessage(tab.id, {
            "message": "block_request",
            "value": isBlocking,
            "apiKey": document.getElementById("apiKeyInput").value,
            "filters": document.getElementById("filtersInput").value.toLowerCase().split(",")
        });
    }
    await chrome.storage.sync.set({ 
        "apiKey": document.getElementById("apiKeyInput").value,
        "filters": document.getElementById("filtersInput").value.toLowerCase().split(",")
    }); 
});

function updateToggleColour(isBlocking, toggleButton) {
    if (isBlocking) {
        toggleButton.style.backgroundColor = "green";
    } else {
        toggleButton.style.backgroundColor = "red";
    }
}
