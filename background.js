let isBlocking = false;
let filters = ["flower"];

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ isBlocking: isBlocking, filters: filters }, () => { 
        console.log(`By default, filters are set to ${filters} and isBlocking is set to ${isBlocking}`);
    }); 
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    chrome.storage.sync.get(null, (items) => {
        console.log("Storage was changed, here's the list:");
        console.log(items);
    });
});
